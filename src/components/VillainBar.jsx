import React, { useEffect, useState } from 'react';

/**
 * Devuelve el set de imágenes (normal y dolor) para un villano/boss específico.
 * villainNumber: 
 *   1..5 => villanos normales
 *   6..7 => bosses
 */
function getVillainImages(villainNumber) {
  switch (villainNumber) {
    case 1:
      return {
        normalHigh: '/brucatkids/images/villano1.png',
        normalMid: '/brucatkids/images/villano1.png',
        normalLow: '/brucatkids/images/villano1.png',
        painHigh: '/brucatkids/images/villano1_dolor.png',
        painMid: '/brucatkids/images/villano1_dolor.png',
        painLow: '/brucatkids/images/villano1_dolor.png',
      };
    case 2:
      return {
        normalHigh: '/brucatkids/images/villano2.png',
        normalMid: '/brucatkids/images/villano2.png',
        normalLow: '/brucatkids/images/villano2.png',
        painHigh: '/brucatkids/images/villano2_dolor.png',
        painMid: '/brucatkids/images/villano2_dolor.png',
        painLow: '/brucatkids/images/villano2_dolor.png',
      };
    case 3:
      return {
        normalHigh: '/brucatkids/images/villano3.png',
        normalMid: '/brucatkids/images/villano3.png',
        normalLow: '/brucatkids/images/villano3.png',
        painHigh: '/brucatkids/images/villano3_dolor.png',
        painMid: '/brucatkids/images/villano3_dolor.png',
        painLow: '/brucatkids/images/villano3_dolor.png',
      };
    case 4:
      return {
        normalHigh: '/brucatkids/images/villano4.png',
        normalMid: '/brucatkids/images/villano4.png',
        normalLow: '/brucatkids/images/villano4.png',
        painHigh: '/brucatkids/images/villano4_dolor.png',
        painMid: '/brucatkids/images/villano4_dolor.png',
        painLow: '/brucatkids/images/villano4_dolor.png',
      };
    case 5:
      return {
        normalHigh: '/brucatkids/images/villano5.png',
        normalMid: '/brucatkids/images/villano5.png',
        normalLow: '/brucatkids/images/villano5.png',
        painHigh: '/brucatkids/images/villano5_dolor.png',
        painMid: '/brucatkids/images/villano5_dolor.png',
        painLow: '/brucatkids/images/villano5_dolor.png',
      };
    case 6: // boss1
      return {
        normalHigh: '/brucatkids/images/boss1.png',
        normalMid: '/brucatkids/images/boss1.png',
        normalLow: '/brucatkids/images/boss1.png',
        painHigh: '/brucatkids/images/boss1_dolor.png',
        painMid: '/brucatkids/images/boss1_dolor.png',
        painLow: '/brucatkids/images/boss1_dolor.png',
      };
    case 7: // boss2
      return {
        normalHigh: '/brucatkids/images/boss2.png',
        normalMid: '/brucatkids/images/boss2.png',
        normalLow: '/brucatkids/images/boss2.png',
        painHigh: '/brucatkids/images/boss2_dolor.png',
        painMid: '/brucatkids/images/boss2_dolor.png',
        painLow: '/brucatkids/images/boss2_dolor.png',
      };
    default:
      // Si no se pasa un número válido, devolvemos villano1 por defecto
      return {
        normalHigh: '/brucatkids/images/villano1.png',
        normalMid: '/brucatkids/images/villano1.png',
        normalLow: '/brucatkids/images/villano1.png',
        painHigh: '/brucatkids/images/villano1_dolor.png',
        painMid: '/brucatkids/images/villano1_dolor.png',
        painLow: '/brucatkids/images/villano1_dolor.png',
      };
  }
}

/**
 * Decide cuál imagen (normal/pain) usar en función del ratio HP.
 * ratio > 0.6 => alto
 * ratio > 0.3 => medio
 * ratio <= 0.3 => bajo
 */
function getDisplayedImage(villainNumber, ratio, villainInPain) {
  const {
    normalHigh, normalMid, normalLow,
    painHigh, painMid, painLow,
  } = getVillainImages(villainNumber);

  let normalImg, painImg;
  if (ratio > 0.6) {
    normalImg = normalHigh;
    painImg = painHigh;
  } else if (ratio > 0.3) {
    normalImg = normalMid;
    painImg = painMid;
  } else {
    normalImg = normalLow;
    painImg = painLow;
  }

  return villainInPain ? painImg : normalImg;
}

/**
 * VillainBar
 * - Muestra 5 villanos normales y 2 boss (prop villainNumber=1..7).
 * - Cada uno con su estado normal y dolor.
 * - Mantiene la barra de HP y efecto de sacudida cuando recibe daño.
 */
const VillainBar = ({
  villainNumber = 1, // 1..5 => villano normal, 6..7 => boss
  villainHP,
  villainMaxHP,
}) => {
  const [hitEffect, setHitEffect] = useState(false);
  const [villainInPain, setVillainInPain] = useState(false);
  const [prevHP, setPrevHP] = useState(villainHP);

  // Detectar si HP bajó => villano recibe daño
  useEffect(() => {
    if (villainHP < prevHP) {
      setHitEffect(true);
      setVillainInPain(true);

      const timer = setTimeout(() => {
        setHitEffect(false);
        setVillainInPain(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    setPrevHP(villainHP);
  }, [villainHP, prevHP]);

  // Calculamos el ratio de HP
  const ratio = villainMaxHP > 0 ? villainHP / villainMaxHP : 0;
  const percentage = Math.max(0, Math.min(ratio * 100, 100));

  // Determinamos la imagen a mostrar
  const displayedImage = getDisplayedImage(villainNumber, ratio, villainInPain);

  return (
    <div className="villain-bar-container highlight-villain">
      <h3 className="villain-label">
        {villainNumber <= 5 ? 'VILLANO' : 'BOSS'}
      </h3>
      <div className={`villain-image ${hitEffect ? 'villain-hit' : ''}`}>
        <img
          src={displayedImage}
          alt="Villano"
          className="villain-img"
        />
      </div>
      <div className="villain-bar">
        <div
          className="villain-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="villain-bar-hp">
        {villainHP} / {villainMaxHP} HP
      </div>
    </div>
  );
};

export default VillainBar;