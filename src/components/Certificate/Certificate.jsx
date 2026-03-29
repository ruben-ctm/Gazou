import { useRef, useState, useEffect } from 'react';
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
      {hasSignature && (
        <button className={styles.clearBtn} onClick={clearCanvas}>
          ✕ Effacer
        </button>
      )}
      {!hasSignature && <p className={styles.sigHint}>Signez ici avec votre doigt ou votre souris</p>}
    </div>
  );
}

export default function Certificate() {
  const certRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    if (!certRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fffdf8',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.height / canvas.width;
      const imgH = pageW * imgRatio;
      const yOffset = imgH < pageH ? (pageH - imgH) / 2 : 0;
      pdf.addImage(imgData, 'PNG', 0, yOffset, pageW, Math.min(imgH, pageH));
      pdf.save('Certificat_Engagement_R&G.pdf');
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
        <div ref={certRef} className={styles.certificate}>
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
                </div>

                <div className={styles.certDivider} />

                {/* Signature zone */}
                <div className={styles.sigRow}>
                  <SignatureCanvas label="Ruben" id="sig-ruben" />
                  <SignatureCanvas label="Garance" id="sig-garance" />
                </div>

                <p className={styles.certFooter}>
                  Fait avec amour · {TODAY} · Sceau R&G
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
    </section>
  );
}
