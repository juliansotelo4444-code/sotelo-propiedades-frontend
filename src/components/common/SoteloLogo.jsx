// Logo SVG de Sotelo Propiedades — rojo y blanco
export default function SoteloLogo({ size = 'md', dark = false }) {
  const heights = { sm: 36, md: 48, lg: 64 }
  const h = heights[size] || 48

  return (
    <svg height={h} viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg" aria-label="Sotelo Propiedades">
      {/* Casa izquierda pequeña */}
      <polygon points="10,55 35,30 60,55" fill="#880000"/>
      <polygon points="35,30 60,55 35,55" fill="#CC0000"/>
      <rect x="16" y="55" width="44" height="20" fill={dark ? '#eeeeee' : '#dddddd'}/>
      <rect x="32" y="62" width="12" height="13" fill={dark ? '#aaaaaa' : '#bbbbbb'}/>

      {/* Casa central grande */}
      <polygon points="55,55 90,18 125,55" fill="#990000"/>
      <polygon points="90,18 125,55 90,55" fill="#DD0000"/>
      <rect x="63" y="55" width="62" height="22" fill={dark ? '#f0f0f0' : '#eeeeee'}/>
      <rect x="82" y="64" width="16" height="13" fill={dark ? '#aaaaaa' : '#cccccc'}/>
      <rect x="67" y="59" width="10" height="8" fill={dark ? '#aaaaaa' : '#cccccc'}/>
      <rect x="103" y="59" width="10" height="8" fill={dark ? '#aaaaaa' : '#cccccc'}/>

      {/* Casa derecha pequeña */}
      <polygon points="120,55 145,30 170,55" fill="#880000"/>
      <polygon points="145,30 170,55 145,55" fill="#CC0000"/>
      <rect x="126" y="55" width="44" height="20" fill={dark ? '#eeeeee' : '#dddddd'}/>
      <rect x="142" y="62" width="12" height="13" fill={dark ? '#aaaaaa' : '#bbbbbb'}/>

      {/* Línea base */}
      <rect x="8" y="75" width="164" height="2.5" rx="1.25" fill="#CC0000"/>

      {/* Texto SOTELO */}
      <text x="182" y="46" fontFamily="Montserrat, Arial Black, sans-serif" fontSize="28" fontWeight="800" fill="#CC0000" letterSpacing="-0.5">SOTELO</text>
      {/* Línea separadora */}
      <rect x="182" y="52" width="132" height="2" fill="#CC0000"/>
      {/* Texto PROPIEDADES */}
      <text x="183" y="66" fontFamily="Montserrat, Arial, sans-serif" fontSize="10" fontWeight="500" fill={dark ? '#cccccc' : '#555555'} letterSpacing="3">PROPIEDADES</text>
      {/* Martillero */}
      <text x="184" y="77" fontFamily="Montserrat, Arial, sans-serif" fontSize="7.5" fill={dark ? '#999999' : '#999999'} letterSpacing="1.5">MARTILLERO PÚBLICO</text>
    </svg>
  )
}
