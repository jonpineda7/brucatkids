import React, { useEffect, useState } from 'react';

/**
 * Devuelve el set de imágenes (normal y dolor) para un villano/boss específico,
 * además de un nombre gracioso asociado.
 * villainNumber: 
 *   1..5 => villanos normales
 *   6..8 => bosses
 */
function getVillainData(villainNumber) {
  switch (villainNumber) {
    case 1:
      return {
        name: 'Don Flojera', // Nombre gracioso
        normalHigh: '/brucatkids/images/villano1.png',
        normalMid: '/brucatkids/images/villano1.png',
        normalLow: '/brucatkids/images/villano1.png',
        painHigh: '/brucatkids/images/villano1_dolor.png',
        painMid: '/brucatkids/images/villano1_dolor.png',
        painLow: '/brucatkids/images/villano1_dolor.png',
      };
    case 2:
      return {
        name: 'Capitán Pizza Loca',
        normalHigh: '/brucatkids/images/villano2.png',
        normalMid: '/brucatkids/images/villano2.png',
        normalLow: '/brucatkids/images/villano2.png',
        painHigh: '/brucatkids/images/villano2_dolor.png',
        painMid: '/brucatkids/images/villano2_dolor.png',
        painLow: '/brucatkids/images/villano2_dolor.png',
      };
    case 3:
      return {
        name: 'El Distraidor',
        normalHigh: '/brucatkids/images/villano3.png',
        normalMid: '/brucatkids/images/villano3.png',
        normalLow: '/brucatkids/images/villano3.png',
        painHigh: '/brucatkids/images/villano3_dolor.png',
        painMid: '/brucatkids/images/villano3_dolor.png',
        painLow: '/brucatkids/images/villano3_dolor.png',
      };
    case 4:
      return {
        name: 'Señor Azúcar',
        normalHigh: '/brucatkids/images/villano4.png',
        normalMid: '/brucatkids/images/villano4.png',
        normalLow: '/brucatkids/images/villano4.png',
        painHigh: '/brucatkids/images/villano4_dolor.png',
        painMid: '/brucatkids/images/villano4_dolor.png',
        painLow: '/brucatkids/images/villano4_dolor.png',
      };
    case 5:
      return {
        name: 'El Miedito',
        normalHigh: '/brucatkids/images/villano5.png',
        normalMid: '/brucatkids/images/villano5.png',
        normalLow: '/brucatkids/images/villano5.png',
        painHigh: '/brucatkids/images/villano5_dolor.png',
        painMid: '/brucatkids/images/villano5_dolor.png',
        painLow: '/brucatkids/images/villano5_dolor.png',
      };
    case 6: // boss1
      return {
        name: 'Mega Aburritón',
        normalHigh: '/brucatkids/images/boss1.png',
        normalMid: '/brucatkids/images/boss1.png',
        normalLow: '/brucatkids/images/boss1.png',
        painHigh: '/brucatkids/images/boss1_dolor.png',
        painMid: '/brucatkids/images/boss1_dolor.png',
        painLow: '/brucatkids/images/boss1_dolor.png',
      };
    case 7: // boss2
      return {
        name: 'Capitán Caos',
        normalHigh: '/brucatkids/images/boss2.png',
        normalMid: '/brucatkids/images/boss2.png',
        normalLow: '/brucatkids/images/boss2.png',
        painHigh: '/brucatkids/images/boss2_dolor.png',
        painMid: '/brucatkids/images/boss2_dolor.png',
        painLow: '/brucatkids/images/boss2_dolor.png',
      };
    case 8: // boss3
      return {
        name: 'Reina Excusa',
        normalHigh: '/brucatkids/images/boss3.png',
        normalMid: '/brucatkids/images/boss3.png',
        normalLow: '/brucatkids/images/boss3.png',
        painHigh: '/brucatkids/images/boss3_dolor.png',
        painMid: '/brucatkids/images/boss3_dolor.png',
        painLow: '/brucatkids/images/boss3_dolor.png',
      };
    default:
      // Si no se pasa un número válido, devolvemos villano1
      return {
        name: 'Desconocido',
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
 */
function getDisplayedImage(villainData, ratio, villainInPain) {
  let normalImg, painImg;

  if (ratio > 0.6) {
    normalImg = villainData.normalHigh;
    painImg = villainData.painHigh;
  } else if (ratio > 0.3) {
    normalImg = villainData.normalMid;
    painImg = villainData.painMid;
  } else {
    normalImg = villainData.normalLow;
    painImg = villainData.painLow;
  }

  return villainInPain ? painImg : normalImg;
}

/**
 * Muestra al villano/boss con su nombre, imagen, y barra de vida.
 */
const VillainBar = ({
  villainNumber = 1,  // 1..5 => villanos, 6..8 => bosses
  villainHP,
  villainMaxHP,
}) => {
  const [hitEffect, setHitEffect] = useState(false);
  const [villainInPain, setVillainInPain] = useState(false);
  const [prevHP, setPrevHP] = useState(villainHP);

  // Cargar la data del villano (nombre + imágenes)
  const villainData = getVillainData(villainNumber);

  // Detectar si HP bajó => animación \"dolor\"
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

  // Calcular ratio
  const ratio = villainMaxHP > 0 ? villainHP / villainMaxHP : 0;
  const percentage = Math.max(0, Math.min(ratio * 100, 100));

  // Determinar imagen a mostrar
  const displayedImage = getDisplayedImage(villainData, ratio, villainInPain);

  // Etiqueta \"VILLANO\" o \"BOSS\" + nombre
  const isBoss = (villainNumber > 5);
  const label = isBoss ? 'BOSS' : 'VILLANO';

  return (
    <div className="villain-bar-container highlight-villain">
      <h3 className="villain-label">
        {label} - {villainData.name}
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