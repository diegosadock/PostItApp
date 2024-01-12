document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
    const postItContainer = document.getElementById('postItContainer');
    let postItCounter = 1;
    let draggedPostIt = null;
    let originalCursor = 'auto';

    // Recupere os post-its salvos do localStorage ao carregar a página
    const savedPostIts = JSON.parse(localStorage.getItem('postIts')) || [];

    // Crie os post-its salvos
    savedPostIts.forEach(savedPostIt => {
        createPostIt(savedPostIt);
    });


    addButton.addEventListener('click', function () {
        createPostIt();
    });

    function createPostIt(savedData = null) {
        
        const postIt = document.createElement('div');
        postIt.className = 'post-it';
        postIt.id = 'post-it-' + postItCounter;

        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-button';
        closeBtn.innerHTML = 'X';

        const textArea = document.createElement('textarea');
        textArea.className = 'text-area';
        textArea.maxLength = 280;

        const charCount = document.createElement('span');
        charCount.className = 'char-count';
        charCount.innerText = '280/280';

        const addNoteButton = document.createElement('span');
        addNoteButton.className = 'addnote-button';
        addNoteButton.innerText = 'Adicionar nota';

        const editNoteButton = document.createElement('span');
        editNoteButton.className = 'editnote-button';
        editNoteButton.innerText = 'Editar nota';
        editNoteButton.style.display = 'none';

        const changeColor = document.createElement('button');
        const cores = ['#ffcc99', '#ffff99', '#99ff99', '#99ccff', '#cc99ff'];
        let corAtualIndex = 0;
        changeColor.className = 'color-selector';

        postIt.appendChild(changeColor);
        postIt.appendChild(addNoteButton);
        postIt.appendChild(editNoteButton);
        postIt.appendChild(closeBtn);
        postIt.appendChild(textArea);
        postIt.appendChild(charCount);

        postItContainer.appendChild(postIt);

        changeColor.addEventListener('click', function() {

            if (corAtualIndex === cores.length - 1) {
                corAtualIndex = 0; // Volte ao início da lista se chegou ao final
            } else {
                corAtualIndex++; // Vá para a próxima cor
            }

            
            const corAtual = cores[corAtualIndex]; // Obtenha a cor atual
            const corClara = clarearCor(corAtual, 20);
            postIt.style.backgroundColor = corAtual;
            textArea.style.backgroundColor = corClara;
            textArea.style.borderColor = corAtual;
            textArea.style.border = `1px solid ${corAtual}`;
            changeColor.style.backgroundColor = corAtual;
            textArea.style.color = black;
        })


        function clarearCor(cor, fator) {
            const hexToInt = (hex) => parseInt(hex, 16);
            const intToHex = (int) => Math.min(255, int).toString(16).padStart(2, '0');
        
            // Extrai os componentes R, G e B da cor
            let r = hexToInt(cor.slice(1, 3));
            let g = hexToInt(cor.slice(3, 5));
            let b = hexToInt(cor.slice(5, 7));
        
            // Clareia os componentes R, G e B
            r = Math.min(255, r + fator);
            g = Math.min(255, g + fator);
            b = Math.min(255, b + fator);
        
            // Converte de volta para a notação hexadecimal
            return `#${intToHex(r)}${intToHex(g)}${intToHex(b)}`;
        }

        closeBtn.addEventListener('click', function () {
            postItContainer.removeChild(postIt);
            savePostIts(); // Salve os post-its após remover um
        });

        textArea.addEventListener('input', function () {
            const currentChars = textArea.value.length;
            charCount.innerText = currentChars + '/280';
        });


        textArea.addEventListener('mousedown', function (e) {
            e.stopPropagation(); // Impede a propagação do evento de clique para o post-it
        });

        addNoteButton.addEventListener('click', function () {
            const authorSpan = document.createElement('span');
            authorSpan.className = 'author';
            authorSpan.innerText = '\n\nAutor: Você';

            editNoteButton.style.display = 'inline-block';
            addNoteButton.style.display = 'none';
            textArea.setAttribute('readonly', 'readonly');
            textArea.style.cursor = 'default';

            postIt.appendChild(authorSpan);
            savePostIts(); // Salve os post-its após adicionar um
        });

        editNoteButton.addEventListener('click', function () {
            textArea.removeAttribute('readonly');
            textArea.style.cursor = 'text';
            editNoteButton.style.display = 'none';
            addNoteButton.style.display = 'inline-block';

            const authorSpan = postIt.querySelector('.author');
            if (authorSpan) {
                postIt.removeChild(authorSpan);
            }

            textArea.focus();
        });

        postIt.addEventListener('mousedown', function (e) {
            draggedPostIt = postIt;
            const offsetX = e.clientX - postIt.getBoundingClientRect().left;
            const offsetY = e.clientY - postIt.getBoundingClientRect().top;

            postIt.style.position = 'absolute';
            postIt.style.zIndex = '1000';
            originalCursor = textArea.style.cursor;

            textArea.style.cursor = 'move';

            const mouseMoveHandler = function (e) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                postIt.style.left = x + 'px';
                postIt.style.top = y + 'px';
            };

            const mouseUpHandler = function () {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
                draggedPostIt = null;

                textArea.style.cursor = originalCursor;
                savePostIts(); // Salve os post-its após mover um
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        postItCounter++;

        // Carregue os dados salvos, se houver, no post-it
        if (savedData) {
            textArea.value = savedData.text;
            charCount.innerText = savedData.text.length + '/280';

            if (savedData.readonly) {
                const authorSpan = document.createElement('span');
                authorSpan.className = 'author';
                authorSpan.innerText = 'Autor: Você';
                postIt.appendChild(authorSpan);
                textArea.setAttribute('readonly', 'readonly');
                textArea.style.cursor = 'default';
                textArea.style.removeProperty('border');
                editNoteButton.style.display = 'inline-block';
                addNoteButton.style.display = 'none';
            }
        }
    }

    function savePostIts() {
        const postIts = [];
        const allPostIts = postItContainer.querySelectorAll('.post-it');

        allPostIts.forEach(postIt => {
            const textArea = postIt.querySelector('.text-area');
            const readonly = textArea.getAttribute('readonly') !== null;

            postIts.push({
                text: textArea.value,
                readonly: readonly,
            });
        });

        // Salve os post-its no localStorage
        localStorage.setItem('postIts', JSON.stringify(postIts));
    }

    document.addEventListener('mousemove', function () {
        if (draggedPostIt) {
            document.body.style.cursor = 'move';
        }
    });

    document.addEventListener('mouseup', function () {
        if (draggedPostIt) {
            document.body.style.cursor = 'auto';
        }
    });
});
