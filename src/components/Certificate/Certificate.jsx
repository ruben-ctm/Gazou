import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './Certificate.module.css';

const TODAY = new Date().toLocaleDateString('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function SignatureCanvas({ label, id }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const lastPos = useRef(null);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0] || e;
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    setDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#2c1a1a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <div className={styles.sigField}>
      <p className={styles.sigLabel}>{label}</p>
      <canvas
        id={id}
        ref={canvasRef}
        className={styles.sigCanvas}
        width={300}
        height={100}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <div className={styles.sigLine} />
      <p className={styles.sigHint}>Signez ici avec votre doigt ou votre souris</p>
      {hasSignature && (
        <button
          data-html2canvas-ignore="true"
          onClick={clearCanvas}
          className={styles.clearBtn}
        >
          Effacer la signature
        </button>
      )}
    </div>
  );
}

export default function Certificate() {
  const certRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);

  const exportPDF = async () => {
    if (!certRef.current) return;
    setExporting(true);
    try {
      // 1. Prepare Garance's signature as Data URL
      const garanceCanvas = document.getElementById('sig-garance');
      const garanceSigBase64 = garanceCanvas ? garanceCanvas.toDataURL('image/png') : null;

      // 2. Prepare Ruben's signature as Data URL (Base64)
      let rubenSigBase64 = null;
      try {
        const resp = await fetch('/signature-ruben.svg');
        const svgText = await resp.text();
        // Base64 encoding is more robust across browsers than encodeURIComponent
        rubenSigBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
      } catch (e) {
        console.warn('Could not pre-fetch signature', e);
      }

      const canvas = await html2canvas(certRef.current, {
        scale: 3, // Higher quality
        useCORS: true,
        allowTaint: true,
        logging: true, // Output debug info for any issues
        imageTimeout: 0, // No timeout for image loading
        backgroundColor: '#fffdf8',
        windowWidth: 794,
        onclone: (doc) => {
          const el = doc.getElementById('cert-document');
          if (el) {
            el.style.width = '794px';
            el.style.maxWidth = 'none';
            el.style.transform = 'none';

            // Flex/Grid fixes for cloning
            const sigRow = el.querySelector('[class*="sigRow"]');
            if (sigRow) sigRow.style.gridTemplateColumns = '1fr 1fr';
            const header = el.querySelector('[class*="certHeader"]');
            if (header) {
              header.style.flexDirection = 'row';
              header.style.textAlign = 'left';
            }

            // Fix dynamic Garance signature by replacing canvas with static image
            const clonedGaranceCanvas = el.querySelector('#sig-garance');
            if (clonedGaranceCanvas && garanceSigBase64) {
              const img = doc.createElement('img');
              img.src = garanceSigBase64;
              // Set explicit dimensions to ensure Chrome renders it
              img.style.width = '300px';
              img.style.height = '100px';
              img.style.objectFit = 'contain';
              img.className = clonedGaranceCanvas.className;
              clonedGaranceCanvas.parentNode.replaceChild(img, clonedGaranceCanvas);
            }

            // Fix Ruben signature by inlining it
            if (rubenSigBase64) {
              const rubenSigImg = el.querySelector('img[alt="Signature Ruben"]');
              if (rubenSigImg) {
                rubenSigImg.src = rubenSigBase64;
                rubenSigImg.style.width = '300px';
                rubenSigImg.style.height = '100px';
              }
            }
          }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.height / canvas.width;
      const imgW = pageW;
      const imgH = imgW * imgRatio;

      // Centre verticalement le diplôme
      const yOffset = imgH < pageH ? (pageH - imgH) / 2 : 0;
      pdf.addImage(imgData, 'PNG', 0, yOffset, imgW, Math.min(imgH, pageH));
      pdf.save('Certificat_Engagement.pdf');
      setShowCallPopup(true);
    } catch (err) {
      console.error(err);
    }
    setExporting(false);
  };

  return (
    <section id="certificate" className={`section ${styles.certSection}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
      >
        {/* The certificate document */}
        <div ref={certRef} id="cert-document" className={styles.certificate}>
          {/* Filigree corners */}
          <div className={`${styles.corner} ${styles.tl}`}>❧</div>
          <div className={`${styles.corner} ${styles.tr}`}>❧</div>
          <div className={`${styles.corner} ${styles.bl}`}>❧</div>
          <div className={`${styles.corner} ${styles.br}`}>❧</div>

          {/* Outer border */}
          <div className={styles.certBorderOuter}>
            <div className={styles.certBorderInner}>

              {/* Header */}
              <div className={styles.certHeader}>
                <div className={styles.certSeal}>
                  <div className={styles.sealOuter}>
                    <div className={styles.sealInner}>
                      <span className={styles.sealText}>R</span>
                      <span className={styles.sealAmp}>&</span>
                      <span className={styles.sealText}>G</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className={styles.certPre}>Acte d'Engagement Solennel</p>
                  <h2 className={styles.certTitle}>Certificat d'Amour</h2>
                  <p className={styles.certPre} style={{ marginTop: '0.3rem' }}>
                    ✦ Document Officiel — Édition Unique ✦
                  </p>
                </div>
              </div>

              <div className={styles.certDivider} />

              {/* Body */}
              <div className={styles.certBody}>
                <p className={styles.certPreamble}>
                  <em>
                    Nous, soussignés, Ruben et Garance, réunis en ce jour du
                    <strong> {TODAY}</strong>, déclarons solennellement et de plein gré
                    notre engagement mutuel à traverser ensemble les chapitres à venir de
                    notre histoire commune.
                  </em>
                </p>

                <div className={styles.certArticles}>
                  <div className={styles.article}>
                    <p className={styles.articleNum}>Article I</p>
                    <p className={styles.articleText}>
                      Les parties s'engagent à continuer de rire ensemble jusqu'à en avoir
                      les larmes aux yeux, au moins une fois par semaine.
                    </p>
                  </div>
                  <div className={styles.article}>
                    <p className={styles.articleNum}>Article II</p>
                    <p className={styles.articleText}>
                      Il est convenu que les anecdotes communes constituent un patrimoine
                      immatériel devant être préservé et régulièrement revisité.
                    </p>
                  </div>
                  <div className={styles.article}>
                    <p className={styles.articleNum}>Article III</p>
                    <p className={styles.articleText}>
                      Les parties s'accordent pour écrire ensemble le prochain chapitre,
                      aussi imprévisible et merveilleux que les précédents.
                    </p>
                  </div>
                  <div className={styles.article}>
                    <p className={styles.articleNum}>Article IV</p>
                    <p className={styles.articleText}>
                      Il est formellement stipulé que les câlins sont obligatoires,
                      que les soirées ensemble comptent double, et que « je t'aime »
                      ne perdra jamais de sa valeur, peu importe le nombre de fois prononcé.
                    </p>
                  </div>
                  <div className={styles.article}>
                    <p className={styles.articleNum}>Article V</p>
                    <p className={styles.articleText}>
                      Les parties reconnaissent que les petits moments du quotidien
                      un ricard partagé, un regard complice, un fou rire inattendu
                      constituent la matière première du bonheur et seront chéris comme tels.
                    </p>
                  </div>
                  <div className={styles.article}>
                    <p className={styles.articleNum}>Article VI</p>
                    <p className={styles.articleText}>
                      Il est acté que chaque dispute, aussi insignifiante soit-elle,
                      se conclura obligatoirement par une réconciliation douce,
                      et que jamais le soleil ne se couchera sur une rancune.
                    </p>
                  </div>
                  <div className={styles.article}>
                    <p className={styles.articleNum}>Article VII</p>
                    <p className={styles.articleText}>
                      Les soussignés s'engagent à continuer d'explorer le monde ensemble,
                      à inventer de nouveaux souvenirs, et à choisir chaque jour,
                      délibérément et avec joie, de s'aimer encore un peu plus qu'hier.
                    </p>
                  </div>
                  <div className={styles.article}>
                    <p className={styles.articleNum}>Article VIII</p>
                    <p className={styles.articleText}>
                      Il est convenu que les voyages, escapades et aventures partagées
                      sont des investissements prioritaires, et que l'inconnu exploré à deux
                      vaut infiniment mieux que le confort exploré seul.
                    </p>
                  </div>
                  <div className={styles.article}>
                    <p className={styles.articleNum}>Article IX</p>
                    <p className={styles.articleText}>
                      Les parties s'accordent le droit inconditionnel d'être imparfaites,
                      de douter, de fléchir et la certitude absolue que l'autre sera là,
                      sans jugement, avec tendresse, pour relever ensemble.
                    </p>
                  </div>
                  <div className={styles.article}>
                    <p className={styles.articleNum}>Article X</p>
                    <p className={styles.articleText}>
                      Le présent certificat est déclaré irrévocable, non soumis à prescription,
                      et valable pour toutes les saisons, toutes les années, et tous les chapitres
                      encore à écrire de cette belle et singulière histoire d'amour.
                    </p>
                  </div>
                </div>

                <div className={styles.certDivider} />

                {/* Signature zone */}
                <div className={styles.sigRow}>
                  <div className={styles.sigField}>
                    <p className={styles.sigLabel}>Ruben</p>
                    <div className={styles.sigCanvas} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
                      <img src="/signature-ruben.svg" alt="Signature Ruben" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div className={styles.sigLine} />
                  </div>
                  <SignatureCanvas label="Garance" id="sig-garance" />
                </div>

                <p className={styles.certFooter}>
                  Fait avec amour · {TODAY} ·
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Export button */}
        <motion.button
          className={`btn-primary ${styles.exportBtn}`}
          onClick={exportPDF}
          disabled={exporting}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {exporting ? '⏳ Génération en cours...' : '📄 Télécharger mon exemplaire PDF'}
        </motion.button>
      </motion.div>

      {showCallPopup && (
        <div
          onClick={() => setShowCallPopup(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fffdf8',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(100,60,20,0.2)',
              border: '2px solid var(--gold)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div style={{ fontSize: '2.5rem' }}>📞</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--velvet)', margin: 0 }}>
              Maintenant, appelle-moi !
            </h3>
            <p style={{ fontFamily: 'var(--font-elegant)', color: 'var(--text-mid)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
              Ton certificat est téléchargé bibiche 🎉<br />
              Il ne manque plus qu'un coup de fil pour le rendre officiel.
            </p>
            <a
              href="tel:0783329934"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, var(--gold), #c89020)',
                color: 'white',
                borderRadius: '50px',
                padding: '0.75rem 2rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.2rem',
                fontWeight: '700',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 16px rgba(212,168,67,0.4)'
              }}
            >
              07 83 32 99 34
            </a>
            <button
              onClick={() => setShowCallPopup(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-elegant)', fontSize: '0.8rem',
                color: 'var(--text-light)', textDecoration: 'underline'
              }}
            >
              Plus tard
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
