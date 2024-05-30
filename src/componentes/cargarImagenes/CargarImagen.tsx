import Imagen from "../../entidades/Imagen";
import { ChangeEvent, useState } from "react";
import '../../slick-theme.css';

type ImagenesArgs = {
    imagen: Imagen,
    handleChange: (key: keyof object, value: any) => void
}

function CargarImagen({imagen, handleChange}:ImagenesArgs) {
    const [cargaEnProgreso, setCargaEnProgreso] = useState<boolean>(false);
    
    const urlimagenes = import.meta.env.VITE_IMG_API_URL;

    const handleImageDelete = () => {
        handleChange('imagen' as keyof object, new Imagen());
    }

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        setCargaEnProgreso(true);
        const imagen:Imagen = new Imagen;
        const jsonImage = {
            "url": "",
            "imageData": ""
        };
        let base64 = "";
        let urlEncriptada = "";
        const file = event.target.files && event.target.files[0];
        
        if (file) {
          // Convertir la imagen a Base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            base64 = reader.result as string;
            jsonImage.imageData = base64;

            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(base64);
    
                // Importar la clave secreta
                const claveSecreta = encoder.encode('clave_secreta'); // Reemplaza 'clave_secreta' con tu clave secreta real
                const clave = await crypto.subtle.importKey(
                    'raw',
                    claveSecreta,
                    { name: 'HMAC', hash: 'SHA-256' },
                    false,
                    ['sign']
                );
    
                // Generar el hash HMAC
                const hashBuffer = await crypto.subtle.sign('HMAC', clave, data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    
                urlEncriptada = hashHex;
                jsonImage.url = urlEncriptada;
    
                await fetch(urlimagenes, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(jsonImage),
                
                    })
                    .then(response => {
                        if (!response.ok) {
                        throw new Error('La solicitud no fue exitosa');
                        }
                        imagen.url = urlimagenes + "/url/" + urlEncriptada;
                        handleChange('imagen' as keyof object, imagen);

                        return response.json(); // Convertir la respuesta a JSON
                    })
                    .catch(error => {
                        console.error('Error al enviar los datos:', error);
                    }).finally(() => {
                        setCargaEnProgreso(false); // Establecer carga en progreso a false cuando la carga finaliza (ya sea éxito o error)
                    });
                    
                } catch (error) {
                    console.error('Error al generar el hash HMAC:', error);
                } finally {
                    setCargaEnProgreso(false);
                }
          };
          reader.readAsDataURL(file);
        }
    };

    return (
    <div className="mb-3" >
    
        <div>
        <div className='row justify-content-center'>
            {(imagen.url) 
              ? <div className='d-flex justify-content-center'>
                    <a onClick={() => handleImageDelete()} className="btn btn-auto p-0" id="btnWithImage">
                        <img src={imagen.url} alt={`Imágen`} style={{ width: '100px', height: '100px' }} />
                        <span className="icono">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        </span>
                    </a>
                </div>
             : <label className='d-flex justify-content-center' htmlFor="imageInput">
                <div
                    style={{
                    width: '100px',
                    height: '100px',
                    border: '1px dashed black',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    }}
                    id='spinWithImage'>   
                     {cargaEnProgreso ? (
                        <div className="spinner-border text-secundary" role="status">
                            <span className="visually-hidden icono">Cargando...</span>
                        </div>
                    ) : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-plus" viewBox="0 0 16 16">
                            <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5"/>
                            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
                        </svg> }
                    
                </div>
                
                </label>
            }
            
            </div>
            <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="imageInput"
            />
            </div>
            
    </div>
    );
}

export default CargarImagen;