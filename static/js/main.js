document.addEventListener("DOMContentLoaded", function() {
    const items = document.querySelectorAll('.beneficio-item');
    items.forEach((item, idx) => {
        setTimeout(() => {
            item.style.opacity = 1;
            item.style.transform = 'translateY(0)';
        }, 300 + idx * 250); // efeito cascata
    });
});



document.addEventListener('DOMContentLoaded', function () {
    // IDs dos campos do formulário
    const campos = [
        'nome_empresa',
        'cnpj',
        'endereco',
        'cnae',
        'pagina_web',
        'ramos_atuacao',
        'celular',
        'telefone'
    ];

    const form = document.getElementById('form-cadastro-empresa');
    if (!form) return; // Garante que só execute na página de cadastro

    // Carregar valores salvos ao abrir a página
    campos.forEach(function (campo) {
        if (localStorage.getItem(campo)) {
            form.elements[campo].value = localStorage.getItem(campo);
        }
    });

    // Salvar valores ao digitar
    campos.forEach(function (campo) {
        form.elements[campo].addEventListener('input', function () {
            localStorage.setItem(campo, this.value);
        });
    });

    // Limpar storage ao enviar o formulário
    form.addEventListener('submit', function () {
        campos.forEach(function (campo) {
            localStorage.removeItem(campo);
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const cnpjInput = document.getElementById('cnpj');
    if (!cnpjInput) return;

    cnpjInput.addEventListener('input', function (e) {
        let value = this.value.replace(/\D/g, ''); // Remove tudo que não for número

        // Limita a 14 dígitos (CNPJ)
        if (value.length > 14) value = value.slice(0, 14);

        // Aplica a máscara: XX.XXX.XXX/0001-XX
        let formatted = '';
        if (value.length > 0) formatted = value.slice(0, 2);
        if (value.length >= 3) formatted += '.' + value.slice(2, 5);
        if (value.length >= 6) formatted += '.' + value.slice(5, 8);
        if (value.length >= 9) formatted += '/' + value.slice(8, 12);
        if (value.length >= 13) formatted += '-' + value.slice(12, 14);

        this.value = formatted;
    });

    // Impede a digitação de qualquer coisa que não seja número
    cnpjInput.addEventListener('keypress', function (e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    // Opcional: ao colar, limpa caracteres não numéricos
    cnpjInput.addEventListener('paste', function (e) {
        e.preventDefault();
        let text = (e.clipboardData || window.clipboardData).getData('text');
        text = text.replace(/\D/g, '').slice(0, 14);
        let formatted = '';
        if (text.length > 0) formatted = text.slice(0, 2);
        if (text.length >= 3) formatted += '.' + text.slice(2, 5);
        if (text.length >= 6) formatted += '.' + text.slice(5, 8);
        if (text.length >= 9) formatted += '/' + text.slice(8, 12);
        if (text.length >= 13) formatted += '-' + text.slice(12, 14);
        this.value = formatted;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const celularInput = document.getElementById('celular2');

    function maskCelular(input) {
        let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        let formatted = '';

        if (value.length > 0) formatted += '(' + value.slice(0, 2);
        if (value.length >= 3) formatted += ') ' + value.slice(2, 3);
        if (value.length >= 4) formatted += ' ' + value.slice(3, 7);
        if (value.length >= 8) formatted += '-' + value.slice(7, 11);

        input.value = formatted;
    }

    celularInput.addEventListener('input', function () {
        maskCelular(this);
    });

    celularInput.addEventListener('keypress', function (e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    celularInput.addEventListener('paste', function (e) {
        e.preventDefault();
        let text = (e.clipboardData || window.clipboardData).getData('text');
        this.value = text.replace(/\D/g, '').slice(0, 11);
        maskCelular(this);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const celularInput = document.getElementById('celular');

    function maskCelular(input) {
        let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        let formatted = '';

        if (value.length > 0) formatted += '(' + value.slice(0, 2);
        if (value.length >= 3) formatted += ') ' + value.slice(2, 3);
        if (value.length >= 4) formatted += ' ' + value.slice(3, 7);
        if (value.length >= 8) formatted += '-' + value.slice(7, 11);

        input.value = formatted;
    }

    celularInput.addEventListener('input', function () {
        maskCelular(this);
    });

    celularInput.addEventListener('keypress', function (e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    celularInput.addEventListener('paste', function (e) {
        e.preventDefault();
        let text = (e.clipboardData || window.clipboardData).getData('text');
        this.value = text.replace(/\D/g, '').slice(0, 11);
        maskCelular(this);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const cnaeGroup = document.getElementById('cnae-group');
    const addCnaeBtn = document.getElementById('add-cnae-btn');

    if (addCnaeBtn && cnaeGroup) {
        addCnaeBtn.addEventListener('click', function () {
            // Cria novo wrapper para o campo CNAE extra
            const wrapper = document.createElement('div');
            wrapper.className = 'cnae-wrapper';

            // Cria novo input
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'cnae[]';
            input.placeholder = 'Digite o CNAE';
            input.className = '';
            input.style.flex = '1';

            // Cria botão de remover
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-cnae-btn';
            removeBtn.title = 'Remover CNAE';
            removeBtn.textContent = '–';
            removeBtn.style.background = 'var(--coral)';
            removeBtn.style.color = 'var(--white)';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '50%';
            removeBtn.style.width = '32px';
            removeBtn.style.height = '32px';
            removeBtn.style.fontSize = '1.5rem';
            removeBtn.style.fontWeight = 'bold';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.marginLeft = '8px';
            removeBtn.style.transition = 'background 0.2s';

            removeBtn.addEventListener('mouseenter', function() {
                removeBtn.style.background = 'var(--brown-dark)';
            });
            removeBtn.addEventListener('mouseleave', function() {
                removeBtn.style.background = 'var(--coral)';
            });

            // Evento para remover o campo
            removeBtn.addEventListener('click', function () {
                cnaeGroup.removeChild(wrapper);
            });

            // Adiciona input e botão ao wrapper
            wrapper.appendChild(input);
            wrapper.appendChild(removeBtn);

            // Insere o novo campo logo após o último .cnae-wrapper
            cnaeGroup.appendChild(wrapper);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Função genérica para campos dinâmicos
    function setupDynamicFields(groupSelector) {
        document.querySelectorAll(groupSelector).forEach(function(group) {
            const addBtn = group.querySelector('.add-dynamic-btn');
            const wrapperClass = 'dynamic-wrapper';
            const inputClass = 'dynamic-input';
            const label = group.dataset.label || '';
            const placeholder = group.dataset.placeholder || '';
            const type = group.dataset.type || 'text';
            const name = group.dataset.name || '';

            if (addBtn) {
                addBtn.addEventListener('click', function () {
                    const wrapper = document.createElement('div');
                    wrapper.className = wrapperClass;

                    const input = document.createElement('input');
                    input.type = type;
                    input.name = name;
                    input.placeholder = placeholder;
                    input.className = inputClass + (type === 'url' ? ' web-input' : '');

                    // Botão de remover
                    const removeBtn = document.createElement('button');
                    removeBtn.type = 'button';
                    removeBtn.className = 'remove-dynamic-btn';
                    removeBtn.title = 'Remover ' + label;
                    removeBtn.textContent = '–';

                    removeBtn.addEventListener('click', function () {
                        group.removeChild(wrapper);
                    });

                    wrapper.appendChild(input);
                    wrapper.appendChild(removeBtn);

                    group.appendChild(wrapper);
                });
            }
        });
    }

    // Ativa para todos os grupos dinâmicos
    setupDynamicFields('.dynamic-group');
});

function maskCNAE(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 9); // Máximo 9 dígitos

    let formatted = '';
    if (value.length < 7){
        formatted = value.slice(0, value.length);
    }
    if (value.length === 7) {
        // 7 dígitos: NN.NNN-N
        formatted = value.slice(0, 4) + '-' + value.slice(4, 5) + '/' + value.slice(5, 7);
    } else if (value.length === 8) {
        // 8 dígitos: NN.NNN-N/N
        formatted = value.slice(0, 2) + '.' + value.slice(2, 5) + '-' + value.slice(5, 6) + '/' + value.slice(6, 8);
    } else if (value.length === 9) {
        // 9 dígitos: NN.NNN-N/NN
        formatted = value.slice(0, 2) + '.' + value.slice(2, 5) + '-' + value.slice(5, 6) + '/' + value.slice(6, 8) + value.slice(8, 9);
    }
    input.value = formatted;
}

// Aplica máscara CNAE em todos os campos existentes e dinâmicos
function setupCNAEMask() {
    function applyMask(e) {
        if (e.target.classList.contains('cnae-input')) {
            maskCNAE(e.target);
        }
    }
    document.querySelectorAll('.cnae-input').forEach(function(input) {
        input.addEventListener('input', applyMask);
        input.addEventListener('keypress', function (e) {
            if (!/[0-9]/.test(e.key)) e.preventDefault();
        });
        input.addEventListener('paste', function (e) {
            e.preventDefault();
            let text = (e.clipboardData || window.clipboardData).getData('text');
            this.value = text.replace(/\D/g, '').slice(0, 9);
            maskCNAE(this);
        });
    });

    // Para campos adicionados dinamicamente
    document.addEventListener('input', applyMask);
    document.addEventListener('keypress', function (e) {
        if (e.target.classList.contains('cnae-input') && !/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });
    document.addEventListener('paste', function (e) {
        if (e.target.classList.contains('cnae-input')) {
            e.preventDefault();
            let text = (e.clipboardData || window.clipboardData).getData('text');
            e.target.value = text.replace(/\D/g, '').slice(0, 9);
            maskCNAE(e.target);
        }
    });
}

document.addEventListener('DOMContentLoaded', setupCNAEMask);

document.addEventListener('DOMContentLoaded', function () {
    const usuarioGroup = document.getElementById('usuario-group');
    const addUsuarioBtn = usuarioGroup.querySelector('.add-usuario-btn');

    if (addUsuarioBtn && usuarioGroup) {
        addUsuarioBtn.addEventListener('click', function () {
            const wrapper = document.createElement('div');
            wrapper.className = 'usuario-wrapper';

            const fields = document.createElement('div');
            fields.className = 'usuario-fields';

            const nomeInput = document.createElement('input');
            nomeInput.type = 'text';
            nomeInput.name = 'nome[]';
            nomeInput.placeholder = 'Nome';
            nomeInput.className = 'dynamic-input';
            nomeInput.required = true;

            const emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.name = 'email[]';
            emailInput.placeholder = 'E-mail';
            emailInput.className = 'dynamic-input';
            emailInput.required = true;

            const celularInput = document.createElement('input');
            celularInput.type = 'tel';
            celularInput.name = 'celular[]';
            celularInput.placeholder = 'Celular';
            celularInput.className = 'dynamic-input';
            celularInput.required = true;

            fields.appendChild(nomeInput);
            fields.appendChild(emailInput);
            fields.appendChild(celularInput);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-usuario-btn';
            removeBtn.title = 'Remover usuário';
            removeBtn.textContent = '–';

            removeBtn.addEventListener('click', function () {
                usuarioGroup.removeChild(wrapper);
            });

            wrapper.appendChild(fields);
            wrapper.appendChild(removeBtn);

            usuarioGroup.appendChild(wrapper);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const fotoInput = document.getElementById('foto');
    const fotoPreview = document.getElementById('foto-preview');

    fotoInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                fotoPreview.innerHTML = ''; // Remove o texto
                fotoPreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const fotoInput = document.getElementById('foto');
    const fotoPreview = document.getElementById('foto-preview');
    const photoModal = document.getElementById('photoModal');
    const movableImage = document.getElementById('movableImage');
    const closeModal = document.getElementById('closeModal');
    const applyChanges = document.getElementById('applyChanges');
    let isDragging = false;
    let offsetX, offsetY;
    let scale = 1;

    fotoInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                movableImage.src = e.target.result;
                movableImage.style.left = '0px';
                movableImage.style.top = '0px';
                photoModal.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }
        fotoInput.value = '';
    });

    document.addEventListener('click', function (e) {
        if (e.target === movableImage) {
            isDragging = !isDragging;
            movableImage.style.cursor = isDragging ? 'grabbing' : 'grab';
            if (isDragging) {
                offsetX = e.clientX - movableImage.offsetLeft;
                offsetY = e.clientY - movableImage.offsetTop;
            }
        } else {
            isDragging = false;
            movableImage.style.cursor = 'grab';
        }
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            movableImage.style.left = `${x}px`;
            movableImage.style.top = `${y}px`;
        }
    });

    movableImage.addEventListener('wheel', function (e) {
        e.preventDefault();
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(0.5, scale), 3); // Limita o zoom entre 0.5x e 3x
        movableImage.style.transform = `scale(${scale})`;
    });

    closeModal.addEventListener('click', function () {
        photoModal.style.display = 'none';
        fotoInput.value = ''; // Cancela o upload
    });

    applyChanges.addEventListener('click', function () {
        const containerRect = document.querySelector('.image-container').getBoundingClientRect();
        const imgRect = movableImage.getBoundingClientRect();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = containerRect.width;
        canvas.height = containerRect.height;

        // Calcula a posição correta dentro do canvas
        const dx = imgRect.left - containerRect.left;
        const dy = imgRect.top - containerRect.top;

        ctx.drawImage(movableImage, dx, dy, imgRect.width, imgRect.height);

        // Cria uma nova imagem a partir do canvas
        const croppedImage = new Image();
        croppedImage.src = canvas.toDataURL();

        // Exibe a imagem cortada no fotoPreview
        fotoPreview.innerHTML = '';
        croppedImage.style.width = '100%';
        croppedImage.style.height = '100%';
        croppedImage.style.objectFit = 'cover';
        fotoPreview.appendChild(croppedImage);

        photoModal.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const fotoInput = document.getElementById('foto');
    const fotoPreview = document.getElementById('foto-preview');
    const photoModal = document.getElementById('photoModal');
    const movableImage = document.getElementById('movableImage');
    const closeModal = document.getElementById('closeModal');
    const applyChanges = document.getElementById('applyChanges');
    let isDragging = false;
    let offsetX, offsetY;
    let scale = 1;

    fotoInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                movableImage.src = e.target.result;
                movableImage.style.left = '0px';
                movableImage.style.top = '0px';
                photoModal.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }
    });

    function startDrag(e) {
        isDragging = true;
        movableImage.style.cursor = 'grabbing';
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        offsetX = clientX - movableImage.offsetLeft;
        offsetY = clientY - movableImage.offsetTop;
    }

    function endDrag() {
        isDragging = false;
        movableImage.style.cursor = 'grab';
    }

    function dragImage(e) {
        if (isDragging) {
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            let x = clientX - offsetX;
            let y = clientY - offsetY;
            movableImage.style.left = `${x}px`;
            movableImage.style.top = `${y}px`;
        }
    }

    movableImage.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mousemove', dragImage);

    movableImage.addEventListener('touchstart', startDrag);
    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchmove', dragImage);

    movableImage.addEventListener('wheel', function (e) {
        e.preventDefault();
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(0.5, scale), 3); // Limita o zoom entre 0.5x e 3x
        movableImage.style.transform = `scale(${scale})`;
    });

    closeModal.addEventListener('click', function () {
        photoModal.style.display = 'none';
        fotoInput.value = ''; // Cancela o upload
    });

    applyChanges.addEventListener('click', function () {
    const containerRect = document.querySelector('.image-container').getBoundingClientRect();
    const imgRect = movableImage.getBoundingClientRect();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    // Calcula a posição correta dentro do canvas
    const dx = (imgRect.left - containerRect.left) / scale;
    const dy = (imgRect.top - containerRect.top) / scale;
    const dWidth = imgRect.width / scale;
    const dHeight = imgRect.height / scale;

    ctx.drawImage(movableImage, dx, dy, dWidth, dHeight, 0, 0, canvas.width, canvas.height);

    // Cria uma nova imagem a partir do canvas
    const croppedImage = new Image();
    croppedImage.onload = function () {
        fotoPreview.innerHTML = '';
        croppedImage.style.width = '100%';
        croppedImage.style.height = '100%';
        croppedImage.style.objectFit = 'cover';
        fotoPreview.appendChild(croppedImage);
    };
    croppedImage.src = canvas.toDataURL();

    photoModal.style.display = 'none';
});
});




document.addEventListener('DOMContentLoaded', function () {
    function setupServiceContainer(containerId) {
        const container = document.getElementById(containerId);
        const addButton = container.querySelector('.add-dynamic-btn2');
        const removeButton = container.querySelector('.remove-dynamic-btn2');
        let quantidadeDeRetangulos = 1;

        addButton.addEventListener('click', function () {
            if (quantidadeDeRetangulos < 10) { // Limita a 10 retângulos
                const newBox = document.createElement('div');
                newBox.className = 'service-box';
                newBox.innerHTML = `
                    <div class="service-box-top"></div>
                    <div class="service-box-bottom">ADICIONAR +</div>
                `;
                container.appendChild(newBox);
                quantidadeDeRetangulos++;


                if (quantidadeDeRetangulos == 2) {
                removeButton.style.display = 'flex';
                removeButton.style.position = 'absolute';
                removeButton.style.left = `(addButton.offsetLeft-100)px`;
                removeButton.style.top = `(addButton.offsetTop)px`;
            }
            }
        });

        removeButton.addEventListener('click', function () {
            const boxes = container.querySelectorAll('.service-box');
            if (quantidadeDeRetangulos > 1) {
                container.removeChild(boxes[boxes.length - 1]);
                quantidadeDeRetangulos--;
            }
            if (quantidadeDeRetangulos <= 1) {
                removeButton.style.display = 'none';
            }
        });

        // Inicializa o estado do botão de remoção
        if (quantidadeDeRetangulos <= 1) {
            removeButton.style.display = 'none';
        }
    }

    // Inicializa cada contêiner de serviços
    setupServiceContainer('service-container-1');
    setupServiceContainer('service-container-2');
});

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('cadastro_servico');
    const closeModal = document.getElementById('closeModal2');
    const fotoServicoInput = document.getElementById('foto-servico');
    const fotoServicoPreview = document.getElementById('foto-servico-preview');

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    fotoServicoPreview.addEventListener('click', function () {
        fotoServicoInput.click();
    });

    fotoServicoInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                fotoServicoPreview.style.backgroundImage = `url(${e.target.result})`;
                fotoServicoPreview.textContent = '';
            };
            reader.readAsDataURL(file);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('cadastro_servico');
    const closeModal = document.getElementById('closeModal');
    const serviceBoxes = document.querySelectorAll('.service-box');
    let currentServiceBox = null;

    serviceBoxes.forEach(box => {
        box.addEventListener('click', function () {
            currentServiceBox = box;
            modal.style.display = 'flex';
        });
    });

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    const addButton = document.querySelector('.cta-btn-bottom');
    addButton.addEventListener('click', function () {
        const nomeServico = document.getElementById('nome_servico').value;
        const descricaoServico = document.getElementById('descricao_servico').value;
        const precoNormal = document.getElementById('preco_normal').value;
        const precoComunidade = document.getElementById('preco_comunidade').value;

        if (nomeServico && descricaoServico && precoNormal && precoComunidade) {
            if (currentServiceBox) {
                const serviceBoxBottom = currentServiceBox.querySelector('.service-box-bottom');
                serviceBoxBottom.textContent = nomeServico;
            }
            modal.style.display = 'none';
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const formEmpresa = document.getElementById('form-cadastro-empresa');

    if (formEmpresa) {
        formEmpresa.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Verificar se todos os campos obrigatórios estão preenchidos
            const camposObrigatorios = [
                'nome_empresa',
                'cnpj',
                'endereco',
                'celular',
                'email'
            ];

            let todosPreenchidos = true;
            camposObrigatorios.forEach(function(campo) {
                const input = formEmpresa.elements[campo];
                if (!input || input.value.trim() === '') {
                    todosPreenchidos = false;
                    input.classList.add('campo-obrigatorio'); // Adiciona uma classe para destacar o campo
                } else {
                    input.classList.remove('campo-obrigatorio');
                }
            });

            // Verificar se pelo menos um serviço está cadastrado
            const servicos = document.querySelectorAll('.service-box-bottom');
            const peloMenosUmServico = Array.from(servicos).some(service => service.textContent.trim() !== 'ADICIONAR +');

            if (!todosPreenchidos) {
                formEmpresa.reportValidity();
                return;
            }

            if (!peloMenosUmServico) {
                alert('Por favor, cadastre pelo menos um serviço.');
                return;
            }

            // Criar um FormData com os dados do formulário
            const formData = new FormData(formEmpresa);

            // Adicionar dados dos serviços ao FormData
            servicos.forEach((service, index) => {
                const nomeServico = document.getElementById('nome_servico').value.trim();
                const descricaoServico = document.getElementById('descricao_servico').value.trim();
                const precoNormal = document.getElementById('preco_normal').value.trim();
                const precoComunidade = document.getElementById('preco_comunidade').value.trim();
                if (nomeServico) {
                    formData.append(`servicos[${index}][nome]`, nomeServico);
                    formData.append(`servicos[${index}][descricao]`, descricaoServico);
                    formData.append(`servicos[${index}][precoNormal]`, precoNormal);
                    formData.append(`servicos[${index}][precoComunidade]`, precoComunidade);
                }
            });

            // Enviar os dados via AJAX
            fetch('/cadastro-empresa', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                // Sucesso no cadastro
                alert('Empresa cadastrada com sucesso!');
                var empresaIdD = 13;
                // Redirecionar ou atualizar a página conforme necessário
                window.location.href = '/obrigado/' + empresaIdD;
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao processar o cadastro.');
            });
        });
    }
});