// Encontrar o botão de adicionar tarefa
const btnAdicionarTarefa = document.querySelector(".app__button--add-task");
const formAdicionarTarefa = document.querySelector(".app__form-add-task");
const textarea = document.querySelector(".app__form-textarea");
const ulTarefas = document.querySelector(".app__section-task-list");
const paragrafoDescricaoTarefa = document.querySelector(
  ".app__section-active-task-description"
);

const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const btnDeletar = document.querySelector('.app__form-footer__button--delete');

const btnRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodas = document.querySelector("#btn-remover-todas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let tarefaSelecionada = null;
let liTtarefaSelecionada = null;

let tarefaEmEdicao = null;
let paragrafoEmEdicao = null;

function atualizarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  // Cria o SVG diretamente com o conteúdo interno
  const svgHTML = `
  <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
      <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
  </svg>
`;

  // Adiciona o SVG ao <li> usando innerHTML
  li.innerHTML = svgHTML;

  const paragrafo = document.createElement("p");
  paragrafo.textContent = tarefa.descricao;
  paragrafo.classList.add("app__section-task-list-item-description");

  const botao = document.createElement("button");
  botao.classList.add("app_button-edit");

  botao.onclick = () => {
    // debugger
    if (tarefa.completa) return; // Impede edição se tarefa está concluída
  
  // Preenche o formulário com a descrição atual
  formAdicionarTarefa.classList.remove("hidden");
  textarea.value = tarefa.descricao;
  
  // Armazena a tarefa e o parágrafo sendo editados
  tarefaEmEdicao = tarefa;
  paragrafoEmEdicao = paragrafo;
};

  const imagemBotao = document.createElement("img");
  imagemBotao.setAttribute("src", "/imagens/edit.png");

  botao.append(imagemBotao);
  li.append(paragrafo, botao);

  if (tarefa.completa) {
    li.classList.add("app__section-task-list-item-complete");
    botao.setAttribute("disabled", true);
  } else {
    li.onclick = () => {
      document
        .querySelectorAll(".app__section-task-list-item")
        .forEach((elemennto) => {
          elemennto.classList.remove("app__section-task-list-item-active");
        });
      if (tarefaSelecionada === tarefa) {
        paragrafoDescricaoTarefa.textContent = "";
        tarefaSelecionada = null;
        liTtarefaSelecionada = null;
        return;
      }

      tarefaSelecionada = tarefa;
      liTtarefaSelecionada = li;
      paragrafoDescricaoTarefa.textContent = tarefa.descricao;

      li.classList.add("app__section-task-list-item-active");
    };
  }
  return li;
}

// Função para resetar o estado do formulário
function resetarFormulario() {
    formAdicionarTarefa.classList.add('hidden');
    textarea.value = '';
    tarefaEmEdicao = null;
    paragrafoEmEdicao = null;
}

// Evento do botão Cancelar
btnCancelar.addEventListener('click', () => {
    resetarFormulario();
});

// Evento do botão Deletar
btnDeletar.addEventListener('click', () => {
    if (tarefaEmEdicao) {
        // Remove a tarefa do array
        const index = tarefas.findIndex(t => t === tarefaEmEdicao);
        if (index > -1) {
            tarefas.splice(index, 1);
            atualizarTarefas();
            
            // Remove o elemento da DOM
            const liParaRemover = paragrafoEmEdicao.closest('li');
            liParaRemover.remove();
        }
    }
    resetarFormulario();
});

// Modifique o evento de submit do formulário
formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    
    if (!textarea.value.trim()) {
        alert('Digite uma descrição válida!');
        return;
    }

    if (tarefaEmEdicao) {
        // Modo Edição
        tarefaEmEdicao.descricao = textarea.value;
        paragrafoEmEdicao.textContent = textarea.value;
    } else {
        // Modo Criação
        const novaTarefa = {
            descricao: textarea.value,
            completa: false
        };
        tarefas.push(novaTarefa);
        const elementoTarefa = criarElementoTarefa(novaTarefa);
        ulTarefas.append(elementoTarefa);
    }
    
    atualizarTarefas();
    resetarFormulario();
});

btnAdicionarTarefa.addEventListener("click", () => {
    if (formAdicionarTarefa.classList.contains("hidden")) {
      // Se o formulário estava oculto, reseta a edição
      tarefaEmEdicao = null;
      paragrafoEmEdicao = null;
      textarea.value = "";
    }
    formAdicionarTarefa.classList.toggle("hidden");
  });


formAdicionarTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (tarefaEmEdicao) {
    // Modo Edição: Atualiza tarefa existente
    tarefaEmEdicao.descricao = textarea.value;
    paragrafoEmEdicao.textContent = textarea.value;
    atualizarTarefas();
    
    // Reseta o estado de edição
    tarefaEmEdicao = null;
    paragrafoEmEdicao = null;
  } else {
    // Modo Adição: Cria nova tarefa
    const novaTarefa = {
      descricao: textarea.value,
      completa: false
    };
    tarefas.push(novaTarefa);
    const elementoTarefa = criarElementoTarefa(novaTarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
  }
  
  // Limpa e oculta o formulário
  textarea.value = "";
  formAdicionarTarefa.classList.add("hidden");
});

// Carrega as tarefas salvas ao iniciar a página
tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
});

document.addEventListener("focoFinalizado", () => {
  if (tarefaSelecionada && liTtarefaSelecionada) {
    liTtarefaSelecionada.classList.remove("app__section-task-list-item-active");
    liTtarefaSelecionada.classList.add("app__section-task-list-item-complete");
    liTtarefaSelecionada.querySelector("button").setAttribute("disabled", true);
    tarefaSelecionada.completa = true;
    atualizarTarefas();
  }
});

const removerTarevas = (somenteConcluidas) => {
  const seletor = somenteConcluidas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = somenteConcluidas ? tarefas.filter(tarefa => !tarefa.completa) : [];
  atualizarTarefas();
};

btnRemoverConcluidas.onclick = () => removerTarevas(true);
btnRemoverTodas.onclick = () => removerTarevas(false);

