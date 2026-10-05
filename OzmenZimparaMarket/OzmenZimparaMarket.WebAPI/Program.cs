using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Infrastructure;
using OzmenZimparaMarket.Infrastructure.Ayarlar;
using OzmenZimparaMarket.WebAPI.AraKatmanlar;
using OzmenZimparaMarket.WebAPI.Filtreler;
using OzmenZimparaMarket.WebAPI.Modeller;
using System.Text;
using System.Threading.RateLimiting;

try
{
    var builder = WebApplication.CreateBuilder(args);

    // ------------------------------------------------------------
    // ALLOWED HOSTS
    // ------------------------------------------------------------

    var allowedHosts = builder.Configuration["AllowedHosts"];

    if (!builder.Environment.IsDevelopment() &&
        (string.IsNullOrWhiteSpace(allowedHosts) ||
         allowedHosts.Trim() == "*"))
    {
        throw new InvalidOperationException(
            "Production ortamında AllowedHosts açıkça tanımlanmalı ve '*' kullanılamaz.");
    }

    // ------------------------------------------------------------
    // HSTS
    // ------------------------------------------------------------

    builder.Services.AddHsts(options =>
    {
        options.MaxAge = TimeSpan.FromDays(180);
        options.IncludeSubDomains = true;
        options.Preload = false;
    });

    // ------------------------------------------------------------
    // WWWROOT
    // ------------------------------------------------------------

    var webRootDizini = builder.Environment.WebRootPath;

    if (string.IsNullOrWhiteSpace(webRootDizini))
    {
        webRootDizini = Path.Combine(
            builder.Environment.ContentRootPath,
            "wwwroot");
    }

    if (!Directory.Exists(webRootDizini))
    {
        Directory.CreateDirectory(webRootDizini);
    }

    // ------------------------------------------------------------
    // INFRASTRUCTURE
    // ------------------------------------------------------------

    builder.Services.AddInfrastructure(
        builder.Configuration,
        webRootDizini);

    // ------------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------------

    builder.Services.AddScoped<FluentValidationActionFilter>();

    builder.Services.AddControllers(options =>
    {
        options.Filters.AddService<FluentValidationActionFilter>();
    });

    builder.Services.AddValidatorsFromAssembly(
        typeof(IAuthServisi).Assembly);

    // ------------------------------------------------------------
    // SWAGGER
    // ------------------------------------------------------------

    builder.Services.AddEndpointsApiExplorer();

    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Özmen Zımpara Market API",
            Version = "v1",
            Description = "Özmen Zımpara Market ürün, kategori ve yönetim API'si."
        });

        options.AddSecurityDefinition(
            "Bearer",
            new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "JWT token değerini giriniz."
            });

        options.AddSecurityRequirement(
            document => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference(
                    "Bearer",
                    document)] = []
            });
    });

    // ------------------------------------------------------------
    // JWT
    // ------------------------------------------------------------

    var jwtAyarlari = builder.Configuration
        .GetSection(JwtAyarlari.BolumAdi)
        .Get<JwtAyarlari>()
        ?? throw new InvalidOperationException(
            "JWT ayarları okunamadı.");

    if (string.IsNullOrWhiteSpace(jwtAyarlari.GizliAnahtar))
    {
        throw new InvalidOperationException(
            "JWT gizli anahtarı tanımlanmamıştır.");
    }

    if (jwtAyarlari.GizliAnahtar.Length < 32)
    {
        throw new InvalidOperationException(
            "JWT gizli anahtarı en az 32 karakter olmalıdır.");
    }

    if (string.IsNullOrWhiteSpace(jwtAyarlari.Issuer))
    {
        throw new InvalidOperationException(
            "JWT issuer bilgisi tanımlanmamıştır.");
    }

    if (string.IsNullOrWhiteSpace(jwtAyarlari.Audience))
    {
        throw new InvalidOperationException(
            "JWT audience bilgisi tanımlanmamıştır.");
    }

    builder.Services
        .AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme =
                JwtBearerDefaults.AuthenticationScheme;

            options.DefaultChallengeScheme =
                JwtBearerDefaults.AuthenticationScheme;

            options.DefaultScheme =
                JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.MapInboundClaims = false;

            options.RequireHttpsMetadata =
                !builder.Environment.IsDevelopment();

            options.SaveToken = false;

            options.TokenValidationParameters =
                new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,

                    IssuerSigningKey =
                        new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(
                                jwtAyarlari.GizliAnahtar)),

                    ValidateIssuer = true,
                    ValidIssuer = jwtAyarlari.Issuer,

                    ValidateAudience = true,
                    ValidAudience = jwtAyarlari.Audience,

                    ValidateLifetime = true,
                    RequireExpirationTime = true,

                    ClockSkew = TimeSpan.Zero,

                    NameClaimType = "kullaniciAdi"
                };

            options.Events = new JwtBearerEvents
            {
                OnChallenge = async context =>
                {
                    context.HandleResponse();

                    if (context.Response.HasStarted)
                    {
                        return;
                    }

                    var cevap = new ApiHataCevabi
                    {
                        DurumKodu =
                            StatusCodes.Status401Unauthorized,

                        Mesaj =
                            "Bu işlem için giriş yapmanız gerekiyor.",

                        TakipKodu =
                            context.HttpContext.TraceIdentifier
                    };

                    context.Response.StatusCode =
                        StatusCodes.Status401Unauthorized;

                    context.Response.ContentType =
                        "application/json; charset=utf-8";

                    await context.Response.WriteAsJsonAsync(
                        cevap,
                        cancellationToken:
                        context.HttpContext.RequestAborted);
                },

                OnForbidden = async context =>
                {
                    if (context.Response.HasStarted)
                    {
                        return;
                    }

                    var cevap = new ApiHataCevabi
                    {
                        DurumKodu =
                            StatusCodes.Status403Forbidden,

                        Mesaj =
                            "Bu işlemi gerçekleştirmek için yeterli yetkiniz bulunmuyor.",

                        TakipKodu =
                            context.HttpContext.TraceIdentifier
                    };

                    context.Response.StatusCode =
                        StatusCodes.Status403Forbidden;

                    context.Response.ContentType =
                        "application/json; charset=utf-8";

                    await context.Response.WriteAsJsonAsync(
                        cevap,
                        cancellationToken:
                        context.HttpContext.RequestAborted);
                }
            };
        });

    builder.Services.AddAuthorization();

    // ------------------------------------------------------------
    // CORS
    // ------------------------------------------------------------

    var izinVerilenOriginler = builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>()
        ?? Array.Empty<string>();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy(
            "FrontendCors",
            policy =>
            {
                if (izinVerilenOriginler.Length > 0)
                {
                    policy
                        .WithOrigins(izinVerilenOriginler)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                }
            });
    });

    // ------------------------------------------------------------
    // RATE LIMIT
    // ------------------------------------------------------------

    builder.Services.AddRateLimiter(options =>
    {
        options.RejectionStatusCode =
            StatusCodes.Status429TooManyRequests;

        options.AddPolicy(
            "GirisPolitikasi",
            httpContext =>
            {
                var istemciAdresi =
                    httpContext.Connection
                        .RemoteIpAddress?
                        .ToString()
                    ?? "bilinmeyen-istemci";

                return RateLimitPartition
                    .GetFixedWindowLimiter(
                        partitionKey: istemciAdresi,
                        factory: _ =>
                            new FixedWindowRateLimiterOptions
                            {
                                PermitLimit = 5,
                                Window = TimeSpan.FromMinutes(1),
                                QueueLimit = 0,
                                QueueProcessingOrder =
                                    QueueProcessingOrder.OldestFirst,
                                AutoReplenishment = true
                            });
            });

        options.OnRejected =
            async (context, cancellationToken) =>
            {
                var cevap = new ApiHataCevabi
                {
                    DurumKodu =
                        StatusCodes.Status429TooManyRequests,

                    Mesaj =
                        "Çok fazla giriş denemesi yapıldı. Lütfen kısa bir süre sonra tekrar deneyiniz.",

                    TakipKodu =
                        context.HttpContext.TraceIdentifier
                };

                context.HttpContext.Response.StatusCode =
                    StatusCodes.Status429TooManyRequests;

                context.HttpContext.Response.ContentType =
                    "application/json; charset=utf-8";

                await context.HttpContext.Response
                    .WriteAsJsonAsync(
                        cevap,
                        cancellationToken:
                        cancellationToken);
            };
    });

    // ------------------------------------------------------------
    // DOSYA BOYUTLARI
    // ------------------------------------------------------------

    var maksimumDosyaBoyutu =
        builder.Configuration
            .GetValue<long>(
                "Dosya:MaksimumDosyaBoyutu");

    if (maksimumDosyaBoyutu <= 0)
    {
        throw new InvalidOperationException(
            "Maksimum dosya boyutu tanımlanmamıştır.");
    }

    var maksimumIstekBoyutu =
        checked(
            maksimumDosyaBoyutu +
            (1024L * 1024L));

    builder.WebHost.ConfigureKestrel(options =>
    {
        options.Limits.MaxRequestBodySize =
            maksimumIstekBoyutu;
    });

    builder.Services.Configure<FormOptions>(
        options =>
        {
            options.MultipartBodyLengthLimit =
                maksimumIstekBoyutu;
        });

    // ------------------------------------------------------------
    // API VALIDATION RESPONSE
    // ------------------------------------------------------------

    builder.Services.Configure<ApiBehaviorOptions>(
        options =>
        {
            options.InvalidModelStateResponseFactory =
                context =>
                {
                    var hatalar =
                        context.ModelState
                            .Where(
                                x =>
                                    x.Value?.Errors.Count > 0)
                            .ToDictionary(
                                x => x.Key,
                                x => x.Value!.Errors
                                    .Select(
                                        hata =>
                                            string.IsNullOrWhiteSpace(
                                                hata.ErrorMessage)
                                                ? "Gönderilen değer geçersizdir."
                                                : hata.ErrorMessage)
                                    .Distinct()
                                    .ToArray());

                    var cevap =
                        new ApiHataCevabi
                        {
                            DurumKodu =
                                StatusCodes.Status400BadRequest,

                            Mesaj =
                                "Gönderilen bilgiler doğrulanamadı.",

                            TakipKodu =
                                context.HttpContext.TraceIdentifier,

                            Hatalar = hatalar
                        };

                    return new BadRequestObjectResult(
                        cevap);
                };
        });

    // ------------------------------------------------------------
    // BUILD
    // ------------------------------------------------------------

    var app = builder.Build();

    // ------------------------------------------------------------
    // GLOBAL ERROR HANDLING
    // ------------------------------------------------------------

    app.UseMiddleware<GlobalHataYonetimiMiddleware>();

    // ------------------------------------------------------------
    // SWAGGER / HSTS
    // ------------------------------------------------------------

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();

        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint(
                "/swagger/v1/swagger.json",
                "Özmen Zımpara Market API v1");

            options.DocumentTitle =
                "Özmen Zımpara Market API";
        });
    }
    else
    {
        app.UseHsts();
    }

    // ------------------------------------------------------------
    // PIPELINE
    // ------------------------------------------------------------

    app.UseHttpsRedirection();

    app.Use(async (context, next) =>
    {
        context.Response.OnStarting(() =>
        {
            context.Response.Headers[
                "X-Content-Type-Options"] =
                "nosniff";

            return Task.CompletedTask;
        });

        await next();
    });

    app.UseStaticFiles();

    app.UseRouting();

    app.UseCors("FrontendCors");

    app.UseRateLimiter();

    app.UseAuthentication();

    app.UseAuthorization();

    app.MapControllers();

    // ------------------------------------------------------------
    // START
    // ------------------------------------------------------------

    app.Run();
}
catch (Exception ex)
{
    Console.Error.WriteLine(
        "========================================");

    Console.Error.WriteLine(
        "ÖZMEN ZIMPARA MARKET STARTUP HATASI");

    Console.Error.WriteLine(
        "========================================");

    Console.Error.WriteLine(ex.ToString());

    Console.Error.WriteLine(
        "========================================");

    throw;
}