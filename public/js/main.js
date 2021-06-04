window.addEventListener('load', () => {

    let url = 'tasks.json';

    const LoadTasks = {
        data() {
            return {
                tasks: [],
                newTask:[{
                    content: '',
                    highPriority: false
                }],
                inputDisabled: true,
                todoNumber: '',
                complNumber: '',
                totalNumber: '',
                popupOpen: false,
                newTaskModal: false,
                editTask: null

            }
        },
        mounted() {
            this.loadTasks()
        },
        computed: {
            activeTasks(){
                let actives = this.tasks.filter(task => {
                    if (task.inProgress && !task.completed) {
                        return task
                    }
                })
                actives = actives.sort((a,b) => b.highPriority - a.highPriority)
                this.todoNumber = actives.length
                return actives
            },

            completedTasks(){
                let completed = this.tasks.filter(task => {
                    if (task.completed) {
                        return task
                    }
                })
                completed = completed.sort((a,b) => b.highPriority - a.highPriority)
                this.complNumber = completed.length
                return completed
            }
        },
        methods: {
            inputCheck() {
                this.inputDisabled = this.newTask.content.length ? false : true;
            },

            loadTasks() {
                axios
                    .get(url)
                    .then(response => {
                        this.tasks = response.data;
                    });
            },
            addTask() {
                let taskIdValue = Date.now();

                let newTaskObj = {
                    taskId: taskIdValue,
                    content: this.newTask.content,
                    highPriority: this.newTask.highPriority,
                    inProgress: true,
                    completed: false
                }

                this.tasks.push(newTaskObj);

                setTimeout(() => {
                    this.newTask.content = ''
                    this.newTask.highPriority = false
                    this.inputDisabled = true
                },200)

                this.closePopup()
            },

            removeTask(task){
                this.tasks.splice(this.tasks.indexOf(task), 1);

                this.closePopup()
            },

            openEdit(task, index) {
                this.popupOpen = true
                this.editTask = this.activeTasks[index]

                setTimeout(() => {
                    document.querySelector('.popup').classList.add('open')
                },200)

            },

            updateComplete(obj) {

                let taskId = obj.taskId
                let task = this.tasks.find(task => task.taskId === taskId)

                setTimeout(() => {
                    task.completed = true
                    task.inProgress = false

                    this.popupOpen = false
                    this.newTaskModal = false
                    this.editTask = null
                },200)

            },
            updateActive(obj) {

                let taskId = obj.taskId
                let task = this.tasks.find(task => task.taskId === taskId)

                console.log(task)

                setTimeout(() => {
                    task.completed = false
                    task.inProgress = true

                    this.popupOpen = false
                    this.newTaskModal = false
                    this.editTask = null
                },200)
            },

            addNewPopup() {
                this.popupOpen = true
                this.newTaskModal = true

                setTimeout(() => {
                    document.querySelector('.popup').classList.add('open')
                },200)
            },

            closePopup() {
                document.querySelector('.popup_wrapper').classList.remove('open')
                document.querySelector('.popup').classList.remove('open')

                setTimeout(() => {
                    this.popupOpen = false
                    this.newTaskModal = false
                    this.editTask = null
                },500)

            }
        }
    }

    Vue.createApp(LoadTasks).mount('#mytrack');


});
