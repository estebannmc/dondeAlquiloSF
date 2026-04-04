import React, { useState } from 'react';

const ReviewForm = ({ propertyId, onReviewSubmit }) => {
  const [formData, setFormData] = useState({
    estrellas: 3,
    presion_agua: 3,
    humedad: '',
    ruido_exterior: '',
    olores_cañerias: '',
    plagas: '',
    revision_electricidad: '',
    revision_gas: '',
    revision_plomeria: '',
    revision_cloacas: '',
    muebles_estado: '',
    comentario: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onReviewSubmit({
      propiedad_id: propertyId,
      ...formData,
      estrellas: parseInt(formData.estrellas),
      presion_agua: parseInt(formData.presion_agua)
    });
    setFormData({
      estrellas: 3,
      presion_agua: 3,
      humedad: '',
      ruido_exterior: '',
      olores_cañerias: '',
      plagas: '',
      revision_electricidad: '',
      revision_gas: '',
      revision_plomeria: '',
      revision_cloacas: '',
      muebles_estado: '',
      comentario: ''
    });
  };

  const RatingSelector = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-2xl transition-colors ${n <= value ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  const YesNoSelector = ({ value, onChange, name }) => (
    <div className="flex gap-4">
      {[
        { val: 'si', label: 'Sí' },
        { val: 'no', label: 'No' },
        { val: 'nsnc', label: 'NS/NC' }
      ].map(opt => (
        <label key={opt.val} className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.val}
            checked={value === opt.val}
            onChange={() => onChange(opt.val)}
            className="accent-blue-600"
          />
          <span className="text-sm text-gray-600">{opt.label}</span>
        </label>
      ))}
    </div>
  );

  const SectionTitle = ({ children }) => (
    <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-2 border-b pb-1">
      {children}
    </h4>
  );

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm bg-white mb-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Nueva Reseña</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Calificación General</label>
        <RatingSelector 
          value={formData.estrellas} 
          onChange={(v) => handleChange('estrellas', v)} 
        />
      </div>

      <SectionTitle>Condiciones del Inmueble</SectionTitle>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            ¿Cómo es la presión de agua?
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range" min="1" max="5" 
              value={formData.presion_agua}
              onChange={(e) => handleChange('presion_agua', parseInt(e.target.value))}
              className="flex-1 accent-blue-600"
            />
            <span className="text-sm font-medium w-6">{formData.presion_agua}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Mala</span><span>Excelente</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            ¿El inmueble tiene problemas de humedad?
          </label>
          <YesNoSelector 
            value={formData.humedad} 
            onChange={(v) => handleChange('humedad', v)}
            name="humedad"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            ¿Hay mucho ruido del exterior?
          </label>
          <YesNoSelector 
            value={formData.ruido_exterior} 
            onChange={(v) => handleChange('ruido_exterior', v)}
            name="ruido_exterior"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            ¿Hay olores provenientes de las cañerías?
          </label>
          <YesNoSelector 
            value={formData.olores_cañerias} 
            onChange={(v) => handleChange('olores_cañerias', v)}
            name="olores_cañerias"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            ¿Hay presencia de plagas (cucarachas, ratas, etc)?
          </label>
          <YesNoSelector 
            value={formData.plagas} 
            onChange={(v) => handleChange('plagas', v)}
            name="plagas"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Estado de los muebles
          </label>
          <select
            className="w-full border rounded p-2 text-sm"
            value={formData.muebles_estado}
            onChange={(e) => handleChange('muebles_estado', e.target.value)}
          >
            <option value="">Seleccionar...</option>
            <option value="excelente">Excelente</option>
            <option value="bueno">Bueno</option>
            <option value="regular">Regular</option>
            <option value="deteriorado">Deteriorado</option>
            <option value="faltantes">Faltantes</option>
            <option value="sin_muebles">Sin muebles</option>
            <option value="nsnc">NS/NC</option>
          </select>
        </div>
      </div>

      <SectionTitle>Revisiones de Seguridad</SectionTitle>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            ¿Te mostraron la última revisión de electricidad?
          </label>
          <YesNoSelector 
            value={formData.revision_electricidad} 
            onChange={(v) => handleChange('revision_electricidad', v)}
            name="revision_electricidad"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            ¿Te mostraron la última revisión de gas?
          </label>
          <YesNoSelector 
            value={formData.revision_gas} 
            onChange={(v) => handleChange('revision_gas', v)}
            name="revision_gas"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            ¿Te mostraron la última revisión de plomería?
          </label>
          <YesNoSelector 
            value={formData.revision_plomeria} 
            onChange={(v) => handleChange('revision_plomeria', v)}
            name="revision_plomeria"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            ¿Te mostraron la última revisión de cloacas?
          </label>
          <YesNoSelector 
            value={formData.revision_cloacas} 
            onChange={(v) => handleChange('revision_cloacas', v)}
            name="revision_cloacas"
          />
        </div>
      </div>

      <SectionTitle>Tu Experiencia</SectionTitle>
      
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Comentario adicional
        </label>
        <textarea
          className="w-full border p-2 rounded text-sm"
          rows="4"
          value={formData.comentario}
          onChange={(e) => handleChange('comentario', e.target.value)}
          placeholder="Cuéntanos más sobre tu experiencia viviendo en este lugar..."
          minLength={20}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          Mínimo 20 caracteres. {formData.comentario.length}/500
        </p>
      </div>

      <button 
        type="submit" 
        className="w-full bg-primary-500 text-white font-bold py-2.5 rounded-lg hover:bg-primary-600 transition"
      >
        Publicar Reseña
      </button>
    </form>
  );
};

export default ReviewForm;
