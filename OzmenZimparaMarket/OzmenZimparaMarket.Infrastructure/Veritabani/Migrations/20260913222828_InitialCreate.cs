using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OzmenZimparaMarket.Infrastructure.Veritabani.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FirmaGenelBilgileri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    SirketAdi = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Hakkimizda = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Vizyonumuz = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Misyonumuz = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Stratejimiz = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KalitePolitikamiz = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Kvkk = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IletisimNo = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    WhatsappNo = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Eposta = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AcikAdres = table.Column<string>(type: "text", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Il = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ilce = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GoogleHaritaBaglantisi = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GoogleHaritaGommeBaglantisi = table.Column<string>(type: "text", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GuncellemeTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FirmaGenelBilgileri", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Kategoriler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UstKategoriId = table.Column<int>(type: "int", nullable: true),
                    KategoriAdi = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Aciklama = table.Column<string>(type: "text", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GorselYolu = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SeoUrl = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SeoBasligi = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SeoAciklamasi = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AnaSayfadaGosterilsinMi = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SiraNo = table.Column<int>(type: "int", nullable: false),
                    AktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    OlusturmaTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6)"),
                    GuncellemeTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kategoriler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Kategoriler_Kategoriler_UstKategoriId",
                        column: x => x.UstKategoriId,
                        principalTable: "Kategoriler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PanelKullanicilari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    KullaniciAdi = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SifreHash = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdSoyad = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    OlusturmaTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6)"),
                    GuncellemeTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PanelKullanicilari", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UrunDetayTanimlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DetayAdi = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CokluDegerMi = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FiltredeGosterilsinMi = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SepetteSecilebilirMi = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SiraNo = table.Column<int>(type: "int", nullable: false),
                    AktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UrunDetayTanimlari", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Urunler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    KategoriId = table.Column<int>(type: "int", nullable: false),
                    UrunAdi = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UrunKodu = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KisaAciklama = table.Column<string>(type: "text", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DetayliAciklama = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GorselYolu = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SatisBirimi = table.Column<int>(type: "int", nullable: false),
                    SeoUrl = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SeoBasligi = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SeoAciklamasi = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OneCikanMi = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SiraNo = table.Column<int>(type: "int", nullable: false),
                    AktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    OlusturmaTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6)"),
                    GuncellemeTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Urunler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Urunler_Kategoriler_KategoriId",
                        column: x => x.KategoriId,
                        principalTable: "Kategoriler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UrunDetaylari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UrunId = table.Column<int>(type: "int", nullable: false),
                    UrunDetayTanimiId = table.Column<int>(type: "int", nullable: false),
                    DetayDegeri = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SiraNo = table.Column<int>(type: "int", nullable: false),
                    AktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UrunDetaylari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UrunDetaylari_UrunDetayTanimlari_UrunDetayTanimiId",
                        column: x => x.UrunDetayTanimiId,
                        principalTable: "UrunDetayTanimlari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UrunDetaylari_Urunler_UrunId",
                        column: x => x.UrunId,
                        principalTable: "Urunler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Kategoriler_AktifMi_SiraNo",
                table: "Kategoriler",
                columns: new[] { "AktifMi", "SiraNo" });

            migrationBuilder.CreateIndex(
                name: "IX_Kategoriler_AnaSayfadaGosterilsinMi_AktifMi",
                table: "Kategoriler",
                columns: new[] { "AnaSayfadaGosterilsinMi", "AktifMi" });

            migrationBuilder.CreateIndex(
                name: "IX_Kategoriler_SeoUrl",
                table: "Kategoriler",
                column: "SeoUrl",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Kategoriler_UstKategoriId",
                table: "Kategoriler",
                column: "UstKategoriId");

            migrationBuilder.CreateIndex(
                name: "IX_PanelKullanicilari_AktifMi",
                table: "PanelKullanicilari",
                column: "AktifMi");

            migrationBuilder.CreateIndex(
                name: "IX_PanelKullanicilari_KullaniciAdi",
                table: "PanelKullanicilari",
                column: "KullaniciAdi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UrunDetaylari_UrunDetayTanimiId",
                table: "UrunDetaylari",
                column: "UrunDetayTanimiId");

            migrationBuilder.CreateIndex(
                name: "IX_UrunDetaylari_UrunId",
                table: "UrunDetaylari",
                column: "UrunId");

            migrationBuilder.CreateIndex(
                name: "IX_UrunDetaylari_UrunId_AktifMi_SiraNo",
                table: "UrunDetaylari",
                columns: new[] { "UrunId", "AktifMi", "SiraNo" });

            migrationBuilder.CreateIndex(
                name: "IX_UrunDetaylari_UrunId_UrunDetayTanimiId_DetayDegeri",
                table: "UrunDetaylari",
                columns: new[] { "UrunId", "UrunDetayTanimiId", "DetayDegeri" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UrunDetayTanimlari_AktifMi_SiraNo",
                table: "UrunDetayTanimlari",
                columns: new[] { "AktifMi", "SiraNo" });

            migrationBuilder.CreateIndex(
                name: "IX_UrunDetayTanimlari_DetayAdi",
                table: "UrunDetayTanimlari",
                column: "DetayAdi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UrunDetayTanimlari_FiltredeGosterilsinMi_AktifMi_SiraNo",
                table: "UrunDetayTanimlari",
                columns: new[] { "FiltredeGosterilsinMi", "AktifMi", "SiraNo" });

            migrationBuilder.CreateIndex(
                name: "IX_UrunDetayTanimlari_SepetteSecilebilirMi_AktifMi_SiraNo",
                table: "UrunDetayTanimlari",
                columns: new[] { "SepetteSecilebilirMi", "AktifMi", "SiraNo" });

            migrationBuilder.CreateIndex(
                name: "IX_Urunler_KategoriId",
                table: "Urunler",
                column: "KategoriId");

            migrationBuilder.CreateIndex(
                name: "IX_Urunler_KategoriId_AktifMi_SiraNo",
                table: "Urunler",
                columns: new[] { "KategoriId", "AktifMi", "SiraNo" });

            migrationBuilder.CreateIndex(
                name: "IX_Urunler_OneCikanMi_AktifMi_SiraNo",
                table: "Urunler",
                columns: new[] { "OneCikanMi", "AktifMi", "SiraNo" });

            migrationBuilder.CreateIndex(
                name: "IX_Urunler_SeoUrl",
                table: "Urunler",
                column: "SeoUrl",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Urunler_UrunKodu",
                table: "Urunler",
                column: "UrunKodu",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FirmaGenelBilgileri");

            migrationBuilder.DropTable(
                name: "PanelKullanicilari");

            migrationBuilder.DropTable(
                name: "UrunDetaylari");

            migrationBuilder.DropTable(
                name: "UrunDetayTanimlari");

            migrationBuilder.DropTable(
                name: "Urunler");

            migrationBuilder.DropTable(
                name: "Kategoriler");
        }
    }
}
