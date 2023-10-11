document.addEventListener("DOMContentLoaded", () => {

    const labels = document.querySelectorAll('form label')

    labels.forEach(label => {
        label.innerHTML = `<i class="fa-solid fa-atom"></i>` + label.innerHTML + `<i class="fa-solid fa-trash del"></i>`
    })

    let delBtn = document.querySelectorAll(".del")
    delBtn.forEach(e => {
        e.addEventListener('click', function(){
            this.parentNode.remove()
        })
    })

    const addBtn = document.getElementById('add')
    const form = document.querySelector('form')
    const btns = document.getElementById('buttons')
    function addOption() {
        const newNode = document.createElement('label')
        form.insertBefore(newNode, btns)  //insert newNode before btns
        document.querySelector('label:last-of-type').innerHTML = `<i class="fa-solid fa-atom"></i>` + `<input type="text" required class="options" placeholder="..." />` + `<i class="fa-solid fa-trash del"></i>`
        let delBtn = document.querySelectorAll(".del")
        delBtn.forEach(e => {
            e.addEventListener('click', function(){
                this.parentNode.remove()
            })
        })
    }
    addBtn.addEventListener('click', addOption)

    const submitBtn = document.getElementById('submit')
    async function functSubmit(e) {
        e.preventDefault()
        const question = document.getElementById('question').value
        const options = Array.from(document.querySelectorAll('.options')).map(option => option.value)  //Array.from() static method creates a new, shallow-copied Array instance from an iterable or array-like object
        const uniqueOptions = [...new Set(options)]

        const idsRes = await fetch('/ids')
        const {ids} = await idsRes.json()
        const id = ids.length === 0 ? 1 : Math.max(...ids) + 1
        
        const res = await fetch('/', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                id,
                question,
                options: uniqueOptions
            })
        })
        if (res.redirected) {
            window.location.href = res.url
        }
        return
    }
    //submit by button or pressing enter
    submitBtn.addEventListener('click', functSubmit)
    document.addEventListener('keypress', (e) => {
        if(e.keyCode == 13) {
            functSubmit()
        }
    })


    


})