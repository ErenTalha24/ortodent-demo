/* Özel Ortodent · Sarmal Dijital
   Tek dosya, kütüphane yok. Eski sitede 2015 sürümü jQuery vardı, kaldırıldı. */
(function () {
  'use strict';

  var TELEFON = '02126697747';
  var WA = '905373991048';

  /* ---------- mobil menü ---------- */
  var burger = document.querySelector('.hamburger');
  var mobMenu = document.querySelector('.mob-menu');
  if (burger && mobMenu) {
    burger.addEventListener('click', function () {
      var acik = mobMenu.classList.toggle('acik');
      burger.setAttribute('aria-expanded', acik ? 'true' : 'false');
    });
    mobMenu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { mobMenu.classList.remove('acik'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------- akordiyon (tedaviler, sorular) ---------- */
  document.querySelectorAll('.akordiyon > button').forEach(function (b) {
    b.addEventListener('click', function () {
      var govde = b.nextElementSibling;
      var acik = govde.classList.toggle('acik');
      b.setAttribute('aria-expanded', acik ? 'true' : 'false');
    });
  });
  // adresteki #baglanti ile gelen bölümü aç
  if (location.hash) {
    var hedef = document.querySelector(location.hash);
    if (hedef && hedef.classList.contains('akordiyon')) {
      var d = hedef.querySelector('button');
      if (d) { d.click(); setTimeout(function () { hedef.scrollIntoView({ block: 'start' }); }, 60); }
    }
  }

  /* ---------- çalışma saatleri: bugünü işaretle ---------- */
  var satirlar = document.querySelectorAll('.saat-tablo tr[data-gun]');
  if (satirlar.length) {
    var bugun = new Date().getDay(); // 0 pazar
    satirlar.forEach(function (tr) {
      if (parseInt(tr.getAttribute('data-gun'), 10) === bugun) tr.classList.add('bugun');
    });
  }

  /* ---------- bugün açık mıyız ---------- */
  var bugunYazi = document.querySelector('[data-bugun]');
  if (bugunYazi) {
    var saatler = { 1: '08:00 - 16:00', 2: '08:00 - 16:00', 3: '12:00 - 20:00',
                    4: '08:00 - 16:00', 5: '08:00 - 16:00', 6: '09:00 - 13:00', 0: null };
    var g = new Date().getDay();
    var s = saatler[g];
    if (s) {
      var simdi = new Date().getHours() * 60 + new Date().getMinutes();
      var parca = s.split(' - ');
      var bas = parseInt(parca[0], 10) * 60 + parseInt(parca[0].split(':')[1], 10);
      var bit = parseInt(parca[1], 10) * 60 + parseInt(parca[1].split(':')[1], 10);
      bugunYazi.textContent = (simdi >= bas && simdi < bit)
        ? 'Şu anda açığız · Bugün ' + s + ' arası hizmet veriyoruz'
        : 'Bugün ' + s + ' arası açığız · Şu anda kapalıyız, mesaj bırakabilirsiniz';
    } else {
      bugunYazi.textContent = 'Bugün pazar, kapalıyız · Yarın 08:00 - 16:00 arası açığız';
    }
  }

  /* ---------- KVKK kutusu ---------- */
  var kvkkAc = document.querySelectorAll('[data-kvkk]');
  var kvkkKutu = document.querySelector('dialog.kvkk');
  kvkkAc.forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); if (kvkkKutu) kvkkKutu.showModal(); });
  });
  var kvkkKapat = document.querySelector('.kvkk-kapat');
  if (kvkkKapat) kvkkKapat.addEventListener('click', function () { kvkkKutu.close(); });

  /* ---------- çerez bildirimi ---------- */
  var cerez = document.querySelector('.cerez');
  if (cerez) {
    var kabul = null;
    try { kabul = localStorage.getItem('ortodent-cerez'); } catch (e) {}
    if (!kabul) cerez.classList.add('gorunur');
    var cerezTamam = cerez.querySelector('.cerez-tamam');
    if (cerezTamam) cerezTamam.addEventListener('click', function () {
      cerez.classList.remove('gorunur');
      try { localStorage.setItem('ortodent-cerez', '1'); } catch (e) {}
    });
  }

  /* ---------- iletişim formu ---------- */
  var form = document.querySelector('form.iletisim');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hatali = false;
      form.querySelectorAll('.alan').forEach(function (alan) {
        var g = alan.querySelector('input, select, textarea');
        if (!g) return;
        var bos = !g.value.trim();
        var gecersiz = g.hasAttribute('required') && (bos || !g.checkValidity());
        if (g.name === 'telefon' && g.value.trim()) {
          var rakam = g.value.replace(/\D/g, '');
          if (rakam.length < 10) gecersiz = true;
        }
        alan.classList.toggle('hatali', gecersiz);
        if (gecersiz && !hatali) { g.focus(); hatali = true; }
      });
      var onay = form.querySelector('input[name="kvkk"]');
      if (onay && !onay.checked) {
        onay.closest('.onay').style.color = '#c0392b';
        if (!hatali) { onay.focus(); hatali = true; }
      } else if (onay) {
        onay.closest('.onay').style.color = '';
      }
      // tuzak alanı: robot doldurursa sessizce durdur
      var tuzak = form.querySelector('input[name="website"]');
      if (tuzak && tuzak.value) return;
      if (hatali) return;

      var d = {};
      new FormData(form).forEach(function (v, k) { d[k] = v; });
      var metin = 'Randevu talebi\n' +
        'Ad Soyad: ' + (d.ad || '') + '\n' +
        'Telefon: ' + (d.telefon || '') + '\n' +
        (d.konu ? 'Konu: ' + d.konu + '\n' : '') +
        (d.tercih ? 'Tercih ettiği zaman: ' + d.tercih + '\n' : '') +
        (d.mesaj ? 'Mesaj: ' + d.mesaj : '');
      var sonuc = form.querySelector('.form-sonuc');
      if (sonuc) {
        sonuc.classList.add('gorunur');
        sonuc.textContent = 'Talebiniz hazırlandı, WhatsApp penceresi açılıyor. Açılmazsa 0212 669 77 47 numaralı telefondan bize ulaşabilirsiniz.';
      }
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(metin), '_blank', 'noopener');
      form.reset();
    });
  }

  /* ---------- randevu asistanı ---------- */
  var acDugme = document.querySelector('.asistan-dugme');
  var panel = document.querySelector('.asistan');
  if (!acDugme || !panel) return;

  var govde = panel.querySelector('.asistan-govde');
  var alt = panel.querySelector('.asistan-alt');
  var cevaplar = {};
  var adim = 0;

  var AKIS = [
    {
      soru: 'Merhaba, ben Ortodent randevu asistanıyım. Hangi konuda randevu istiyorsunuz?',
      anahtar: 'konu',
      secenekler: ['İmplant', 'Ortodonti (tel tedavisi)', 'Diş ağrısı / acil', 'Kontrol ve temizlik', 'Gülüş tasarımı', 'Çocuk diş hekimi']
    },
    {
      soru: 'Hangi gün size uygun?',
      anahtar: 'gun',
      secenekler: ['Bugün', 'Yarın', 'Bu hafta içinde', 'Cumartesi', 'Fark etmez']
    },
    {
      soru: 'Günün hangi saatini tercih edersiniz?',
      anahtar: 'saat',
      secenekler: ['Sabah (08:00-12:00)', 'Öğleden sonra (12:00-16:00)', 'Akşam (16:00-20:00)']
    },
    { soru: 'Adınız ve soyadınız?', anahtar: 'ad', giris: 'Ad Soyad' },
    { soru: 'Size ulaşabileceğimiz telefon numaranız?', anahtar: 'telefon', giris: '05XX XXX XX XX', tip: 'tel' }
  ];

  function balonEkle(metin, kim) {
    var d = document.createElement('div');
    d.className = 'balon ' + (kim === 'kisi' ? 'kisi' : 'asistan-balon');
    d.textContent = metin;
    govde.appendChild(d);
    govde.scrollTop = govde.scrollHeight;
    return d;
  }

  function yaziyorGoster() {
    var d = document.createElement('div');
    d.className = 'balon asistan-balon yaziyor';
    d.innerHTML = '<i></i><i></i><i></i>';
    govde.appendChild(d);
    govde.scrollTop = govde.scrollHeight;
    return d;
  }

  function seceneklerGoster(liste, anahtar) {
    var kutu = document.createElement('div');
    kutu.className = 'secenekler';
    liste.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = s;
      b.addEventListener('click', function () {
        cevaplar[anahtar] = s;
        balonEkle(s, 'kisi');
        kutu.remove();
        adim++;
        sonrakiAdim();
      });
      kutu.appendChild(b);
    });
    govde.appendChild(kutu);
    govde.scrollTop = govde.scrollHeight;
  }

  function girisGoster(a) {
    alt.innerHTML = '';
    var giris = document.createElement('input');
    giris.type = a.tip || 'text';
    giris.placeholder = a.giris;
    giris.setAttribute('aria-label', a.giris);
    var b = document.createElement('button');
    b.className = 'dugme birincil';
    b.type = 'button';
    b.textContent = 'Devam';
    function gonder() {
      var v = giris.value.trim();
      if (a.anahtar === 'telefon' && v.replace(/\D/g, '').length < 10) {
        giris.style.borderColor = '#c0392b';
        return;
      }
      if (!v) { giris.style.borderColor = '#c0392b'; return; }
      cevaplar[a.anahtar] = v;
      balonEkle(v, 'kisi');
      alt.innerHTML = '';
      adim++;
      sonrakiAdim();
    }
    b.addEventListener('click', gonder);
    giris.addEventListener('keydown', function (e) { if (e.key === 'Enter') gonder(); });
    alt.appendChild(giris);
    alt.appendChild(b);
    giris.focus();
  }

  function sonrakiAdim() {
    if (adim < AKIS.length) {
      var a = AKIS[adim];
      var y = yaziyorGoster();
      setTimeout(function () {
        y.remove();
        balonEkle(a.soru);
        if (a.secenekler) seceneklerGoster(a.secenekler, a.anahtar);
        else girisGoster(a);
      }, 550);
      return;
    }
    // özet ve WhatsApp aktarımı
    var y2 = yaziyorGoster();
    setTimeout(function () {
      y2.remove();
      balonEkle('Teşekkürler ' + (cevaplar.ad || '') + '. Talebinizi aldım:\n' +
        '· Konu: ' + cevaplar.konu + '\n· Gün: ' + cevaplar.gun + '\n· Saat: ' + cevaplar.saat +
        '\nOnaylarsanız kliniğe ileteyim, en kısa sürede sizi arayıp saati kesinleştirsinler.');
      var kutu = document.createElement('div');
      kutu.className = 'secenekler';
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = 'Evet, kliniğe ilet';
      b.addEventListener('click', function () {
        var metin = 'Randevu talebi\n' +
          'Ad Soyad: ' + cevaplar.ad + '\n' +
          'Telefon: ' + cevaplar.telefon + '\n' +
          'Konu: ' + cevaplar.konu + '\n' +
          'Gün: ' + cevaplar.gun + '\n' +
          'Saat tercihi: ' + cevaplar.saat;
        window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(metin), '_blank', 'noopener');
        kutu.remove();
        balonEkle('Talebiniz WhatsApp üzerinden kliniğe iletildi. Acil durumda 0212 669 77 47 numarasından da ulaşabilirsiniz.');
      });
      var b2 = document.createElement('button');
      b2.type = 'button';
      b2.textContent = 'Baştan başla';
      b2.addEventListener('click', function () { govde.innerHTML = ''; alt.innerHTML = ''; adim = 0; cevaplar = {}; sonrakiAdim(); });
      kutu.appendChild(b); kutu.appendChild(b2);
      govde.appendChild(kutu);
      govde.scrollTop = govde.scrollHeight;
    }, 650);
  }

  acDugme.addEventListener('click', function () {
    panel.classList.add('acik');
    acDugme.style.display = 'none';
    if (!govde.children.length) sonrakiAdim();
    panel.querySelector('.kapat').focus();
  });
  panel.querySelector('.kapat').addEventListener('click', function () {
    panel.classList.remove('acik');
    acDugme.style.display = 'flex';
    acDugme.focus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('acik')) panel.querySelector('.kapat').click();
  });
})();
