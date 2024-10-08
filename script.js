let todoData = [];
let listIndex = null;
let taskIndex = null;

let stringTodoData = localStorage.getItem("todoData");
if(stringTodoData){
    todoData = JSON.parse(stringTodoData);
}

renderTodo();

function handleAddListBtnClick(){
    todoData.push({
        title:'',
        tasks:[]
    })
    
    let stringTodoData = JSON.stringify(todoData);
    localStorage.setItem("todoData", stringTodoData);

    renderTodo();
    handleListInput();
}

function handleAddTaskBtnClick(){
    todoData.forEach((_, idx)=> {
        const addTaskBtn = document.getElementById(`add_task_btn_${idx}`);

        addTaskBtn.addEventListener('click', function(){
            todoData[idx].tasks.push({title:'',description:''});

            let stringTodoData = JSON.stringify(todoData);
            localStorage.setItem("todoData", stringTodoData);

            renderTodo();
        })
    })
}

function handleListInput() {
    todoData.forEach((_, idx)=> {
        const listTitleInput = document.getElementById(`list_title_input_${idx}`);

        listTitleInput.addEventListener('input',function(event){
        let value = event.target.value;
        todoData[idx].title = value;

        let stringTodoData = JSON.stringify(todoData);
        localStorage.setItem("todoData", stringTodoData);
    })
    })
}

function handleTaskInput() {
    todoData.forEach((list,lIdx) => {
        list.tasks.forEach((_, idx) => {
            const taskInput = document.getElementById(`task_input_${lIdx}_${idx}`);
            taskInput.addEventListener('input', function(event){
                let value = event.target.value;
                todoData[lIdx].tasks[idx].title = value;

                let stringTodoData = JSON.stringify(todoData);
                localStorage.setItem("todoData", stringTodoData);
            });
        })
    });
}

function handleTaskModal() {
    todoData.forEach((list,lIdx) => {
        list.tasks.forEach((task, tIdx) => {
            const taskDetailsBtn = document.getElementById(`task_details_btn_${lIdx}_${tIdx}`);
            const taskModal = document.getElementById('task_modal');
            const closeBtn = document.getElementById("modal_close_btn");
            const taskTitle = document.getElementById('modal_task_title');
            const taskDescription = document.getElementById('modal_task_description');

            taskDetailsBtn.addEventListener('click', function(){
                taskTitle.value = task.title;
                taskDescription.value = task.description;

                taskModal.style.display = "block";
                listIndex=lIdx;
                taskIndex=tIdx;
            });

            closeBtn.addEventListener('click', function(){
                taskModal.style.display = "none";
                taskTitle.value = "";
                taskDescription.value = "";
                listIndex= null;
                taskIndex= null;

                renderTodo();
            });

            taskTitle.addEventListener('input', function(event){
                if(event.target.value && listIndex !== null && taskIndex !== null){
                    todoData[listIndex].tasks[taskIndex].title = event.target.value;
                
                    let stringTodoData = JSON.stringify(todoData);
                    localStorage.setItem("todoData", stringTodoData);
                }
            });

            taskDescription.addEventListener('input', function(event){
                if(event.target.value && listIndex !== null && taskIndex !== null){
                    todoData[listIndex].tasks[taskIndex].description = event.target.value;
                
                    let stringTodoData = JSON.stringify(todoData);
                    localStorage.setItem("todoData", stringTodoData);
                }
            });
        })
    });
}

function renderTodo() {
    const todoSection = document.getElementById('todo_section');
    let listDiv = '';

    for(let list = 0; list < todoData.length; list++){
        listDiv += `<div id="list_title_${list}" data-list-index="${list}" class='list-title' draggable="true">`
            listDiv +=  `<input id='list_title_input_${list}' class='list-input' data-list-index="${list}" type="text" value="${todoData[list].title}" placeholder="Enter list name"> `

            if(!todoData[list].tasks){
                console.log("Tasks not found.Index:" + list);
            }
            for(let task = 0; task < todoData[list].tasks.length; task++){
                listDiv += `
                <div class='task-card' data-list-index="${list}" data-task-index="${task}" draggable="true">
                    <input id="task_input_${list}_${task}" type="text" class="task-input" value="${todoData[list].tasks[task].title}" data-list-index="${list}" data-task-index="${task}" placeholder="Enter task name">
                    <button id="task_details_btn_${list}_${task}" class="task-details-btn">Details</button>
                </div>
                    `
            }

            listDiv +=  `<button id="add_task_btn_${list}" class='add-task-btn'>+ Add New Task</button>`
        listDiv +=  `</div>`
    }
        listDiv +=`
            <div>
                <button id="add_list_btn">+ Add New List</button>
            </div>
        `
    todoSection.innerHTML = listDiv;

    const addListBtn = document.getElementById('add_list_btn');
    addListBtn.addEventListener('click',handleAddListBtnClick);

    handleAddTaskBtnClick();
    handleListInput();
    handleTaskInput();
    handleTaskModal();


    taskDragAndDrop();
    listDragAndDrop();

}

function taskDragAndDrop(){
    const taskCards = document.querySelectorAll('.task-card');
    let draggedElement = null;

    taskCards.forEach(taskCard => {
        taskCard.addEventListener('dragstart',(event)=>{
            event.stopPropagation();
            draggedElement = taskCard;
        })

        taskCard.addEventListener('dragend',(event)=>{
            event.stopPropagation();
            draggedElement = null;
        })

        taskCard.addEventListener('dragover', (event) => {
            event.stopPropagation();
            event.preventDefault();
        });

        taskCard.addEventListener('drop', (event) => {
            event.stopPropagation();
            event.preventDefault();
            if (draggedElement) {
                const sourceListIndex = draggedElement.getAttribute('data-list-index');
                const sourceTaskIndex = draggedElement.getAttribute("data-task-index");

                const targetListIndex = event.target.getAttribute("data-list-index");
                const targetTaskIndex = event.target.getAttribute("data-task-index");

                const task = todoData[sourceListIndex].tasks.splice(sourceTaskIndex,1)[0];
                todoData[targetListIndex].tasks.splice(targetTaskIndex, 0, task);

                renderTodo();
            }
        });
    })
    

}

function listDragAndDrop(){
    const listContainers = document.querySelectorAll('.list-title');
    let draggedElement = null;

    listContainers.forEach(container => {
        container.addEventListener('dragstart',(event)=>{
            draggedElement = container;
        })

        container.addEventListener('dragend',()=>{
            draggedElement = null;
        })

        container.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        container.addEventListener('drop', (event) => {
            event.preventDefault();
            if (draggedElement) {
                const sourceListIndex = draggedElement.getAttribute('data-list-index');
                const targetListIndex = event.target.getAttribute('data-list-index');
                
                const task = todoData.splice(sourceListIndex, 1)[0];
                todoData.splice(targetListIndex, 0, task);

                renderTodo();
            }
        });
    })
}

