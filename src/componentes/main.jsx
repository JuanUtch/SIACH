import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación

const areas = [
  {
    nombre: 'Producción',
    puestos: [
      'Ayudante de empaque y envase',
      'Ayudante de limpieza',
      'Operador de peletizadora',
      'Dosificador de micros',
      'Operador de rolado',
      'Operador de molino',
      'Dosificador de mezclas',
      'Coordinador de mantenimiento',
      'Ayudante de mantenimiento',
      'Operador de caldera',
      'Ayudante de mantenimiento soldadura',
      'Ayudante de mantenimiento eléctrico',
      'Ayudante de mantenimiento mecánico',
      'Embolsador',
      'Auxiliar de calidad',
      'Ayudante de albañil',
      'Supervisor de planta',
      'Recibidor de granos',
      'Coordinador de empaque',
      'Coordinador de seguridad e higiene',
      'MVZ. Responsable',
      'Superintendente de producción',
      'Ingeniero en proyectos'
    ],
  },
  {
    nombre: 'Operación',
    puestos: [
      'Ayudante de almacén',
      'Almacenista',
      'Montacarguista',
      'Operador de enmelazadora',
      'Investigación y desarrollo'
    ],
  },
  {
    nombre: 'Envase y empaque',
    puestos: [
      'Envasador',
      'Ayudante de empaque, envase (Cosedor)',
      'Estibadores',
      'Ayudante de empaque, envase (Circulante)',
      'Ayudante de empaque, envase (amarrador)'
    ],
  },
  {
    nombre: 'Ventas',
    puestos: [
      'Estibador',
      'Repartidor',
      'Chofer'
    ],
  },
];

const initialData = {
  area: areas[0].nombre,
  puestoTrabajo: areas[0].puestos[0] || '',
  descripcionActividad: 'Recibir, alistar, empacar y entregar, productos en condiciones adecuadas de aseo e higiene.',
  fechaInspeccion: '15/03/2023',
  tiempoExposicion: '8 hrs',
  partesCuerpo: {
    cabezaOidos: false,
    ojosCara: false,
    sistemaRespiratorio: false,
    brazosManos: false,
    tronco: false,
    extremidadesInferiores: false,
  },
  identificacionPeligros: {
    'Caídas de Altura': false,
    'Exposición a Temperaturas': false,
    'Exposición a Electricidad Estática': false,
    'Exposición a Sustancias Químicas': false,
    'Exposición a Radiaciones': false,
    'Exposición agentes Biológicos': false,
    'Exposición a Ruido': false,
    'Exposición a Vibraciones': false,
    'Superficies cortantes': false,
    'Caídas a nivel o desnivel': false,
    'Daños Ergonómicos': false,
    'Calentamiento de materia prima, subproducto o producto': false,
    'Proyección de material o herramienta': false,
    'Mantenimiento preventivo, correctivo o predictivo': false,
  },
  equipoProteccion: 'Uso obligatorio de zapatos dieléctricos, lentes, tapones auditivos, casco, mascarilla vs polvos, guantes de nitrilo y overol.',
  evaluacionRiesgo: {
    consecuencia: 5,
    exposicion: 2,
    probabilidad: 1,
    magnitudRiesgo: 10,
  },
};

const dangerToBodyParts = {
  'Caídas de Altura': ['cabezaOidos', 'brazosManos', 'extremidadesInferiores'],
  'Exposición a Temperaturas': ['ojosCara', 'sistemaRespiratorio', 'brazosManos'],
  'Exposición a Electricidad Estática': ['ojosCara', 'tronco'],
  'Exposición a Sustancias Químicas': ['ojosCara', 'brazosManos', 'tronco', 'sistemaRespiratorio'],
  'Exposición a Radiaciones': ['ojosCara', 'tronco'],
  'Exposición agentes Biológicos': ['ojosCara', 'brazosManos', 'sistemaRespiratorio'],
  'Exposición a Ruido': ['ojosCara', 'brazosManos'],
  'Exposición a Vibraciones': ['brazosManos', 'tronco'],
  'Superficies cortantes': ['brazosManos'],
  'Caídas a nivel o desnivel': ['cabezaOidos', 'brazosManos', 'extremidadesInferiores'],
  'Daños Ergonómicos': ['tronco', 'brazosManos'],
  'Calentamiento de materia prima, subproducto o producto': ['ojosCara', 'brazosManos'],
  'Proyección de material o herramienta': ['ojosCara', 'brazosManos', 'tronco'],
  'Mantenimiento preventivo, correctivo o predictivo': ['brazosManos', 'tronco'],
};

const calculateRiskLevel = (consecuencia, exposicion, probabilidad) => {
  const magnitud = consecuencia * exposicion * probabilidad;
  if (magnitud <= 5) return 'Bajo o Aceptable';
  if (magnitud <= 10) return 'Tolerable';
  return 'Alto o Inaceptable';
};

const Main = () => {
  const [data, setData] = useState(initialData);
  const [puestos, setPuestos] = useState(areas.find(area => area.nombre === initialData.area)?.puestos || []);

  const handleAreaChange = (event) => {
    const selectedArea = event.target.value;
    const areaData = areas.find(area => area.nombre === selectedArea);
    setPuestos(areaData?.puestos || []);
    const newPuesto = areaData?.puestos[0] || '';
    setData(prevData => ({
      ...prevData,
      area: selectedArea,
      puestoTrabajo: newPuesto,
    }));
  };

  const handlePuestoChange = (event) => {
    const newPuesto = event.target.value;
    setData(prevData => ({
      ...prevData,
      puestoTrabajo: newPuesto
    }));
  };

  const handlePeligroChange = (event) => {
    const { name, checked } = event.target;
    setData(prevData => {
      const updatedPeligros = {
        ...prevData.identificacionPeligros,
        [name]: checked
      };

      // Actualiza las partes del cuerpo expuestas en función de los peligros seleccionados
      const updatedPartesCuerpo = { ...prevData.partesCuerpo };

      Object.keys(dangerToBodyParts).forEach(danger => {
        dangerToBodyParts[danger].forEach(part => {
          if (updatedPeligros[danger]) {
            updatedPartesCuerpo[part] = true;
          } else {
            // Si ningún otro peligro está asociado con esta parte del cuerpo, desmarca
            const anyOtherDanger = Object.keys(updatedPeligros).some(otherDanger =>
              dangerToBodyParts[otherDanger].includes(part) && updatedPeligros[otherDanger]
            );
            if (!anyOtherDanger) {
              updatedPartesCuerpo[part] = false;
            }
          }
        });
      });

      return {
        ...prevData,
        identificacionPeligros: updatedPeligros,
        partesCuerpo: updatedPartesCuerpo
      };
    });
  };

  return (
    <div className="app">
      <h1>Estudio de Riesgo</h1>
      <div className="data-section">
        <h2>Seleccionar Área y Puesto</h2>
        <label>
          Área:
          <select value={data.area} onChange={handleAreaChange}>
            {areas.map((area, index) => (
              <option key={index} value={area.nombre}>
                {area.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Puesto de trabajo:
          <select value={data.puestoTrabajo} onChange={handlePuestoChange}>
            {puestos.map((puesto, index) => (
              <option key={index} value={puesto}>
                {puesto}
              </option>
            ))}
          </select>
        </label>

        <h2>Detalles del Puesto</h2>
        <p><strong>Descripción de la actividad:</strong> {data.descripcionActividad}</p>
        <p><strong>Fecha de inspección:</strong> {data.fechaInspeccion}</p>
        <p><strong>Tiempo de exposición:</strong> {data.tiempoExposicion}</p>

        <h2>Partes del Cuerpo Expuestas al Riesgo</h2>
        <ul>
          {Object.keys(data.partesCuerpo).map((part, index) => (
            <li key={index}>
              {part.replace(/([A-Z])/g, ' $1').toUpperCase()}: {data.partesCuerpo[part] ? 'X' : ' '}
            </li>
          ))}
        </ul>

        <h2>Identificación de Peligros</h2>
        <ul>
          {Object.keys(data.identificacionPeligros).map((peligro, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  name={peligro}
                  checked={data.identificacionPeligros[peligro]}
                  onChange={handlePeligroChange}
                />
                {peligro}
              </label>
            </li>
          ))}
        </ul>

        <h2>Equipo de Protección Personal Sugerido</h2>
        <p>{data.equipoProteccion}</p>

        <h2>Evaluación de Riesgo</h2>
        <p><strong>Consecuencia:</strong> {data.evaluacionRiesgo.consecuencia}</p>
        <p><strong>Exposición:</strong> {data.evaluacionRiesgo.exposicion}</p>
        <p><strong>Probabilidad:</strong> {data.evaluacionRiesgo.probabilidad}</p>
        <p><strong>Magnitud del Riesgo:</strong> {calculateRiskLevel(data.evaluacionRiesgo.consecuencia, data.evaluacionRiesgo.exposicion, data.evaluacionRiesgo.probabilidad)}</p>
      </div>

      <div className="navigation">
        <Link to="/">Regresar a App</Link>
      </div>
    </div>
  );
};

export default Main;
