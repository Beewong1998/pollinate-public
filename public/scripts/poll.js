document.addEventListener('DOMContentLoaded', () => {       
    const id = window.location.pathname.replaceAll('/','')   // returns the pathname of the current page /id. / is replaced so just returns id
    const currUrl = window.location.href   //gets the url
    const urlDiv = document.getElementById('url')
    urlDiv.innerText = currUrl

    const question = document.querySelector('main > h1')
    const optionsList = document.querySelector('ul')
    let optionsFromServer = []
    async function onLoad() {
        const idsRes = await fetch('/ids')
        const {ids} = await idsRes.json()
        if (!ids.includes(id)) {
            window.location.href = '/'     //sends you back to the homepage if id is not valid
        }

        const res = await fetch('/data/' + id)
        const {data} = await res.json()
        optionsFromServer = data.options   //{"option":value,"option":value,"option":value}
        question.innerText = data.question + (data.question.includes('?') ? "" : "?")

        let newInnerListHTML = ""
        Object.keys(data.options).forEach((option, index) => {
            newInnerListHTML += `<li id="${option}"><i class="fa-solid fa-seedling"></i>${option}</li>`
        })
        optionsList.innerHTML = newInnerListHTML

        const optionsLi = document.querySelectorAll('li')
        optionsLi.forEach(option => {
            option.addEventListener('click', pplClick)
        })    

    }
    onLoad()

    async function pplClick(index) {
        const selected = index.target.id
        let maxNumberOfVotes = Math.max(...Object.values(optionsFromServer))

        const optionsLi = document.querySelectorAll('li')

        //send result to server
        const res = await fetch('/vote', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id,
                vote: selected  //selected is index.target.id which is the id of the <li></li>
            })
        }) 
        optionsLi.forEach(val => {
            const option = val.id
            val.removeEventListener('click', pplClick)
            val.style.cursor = "default"
            let barDiv = document.createElement("div")
            barDiv.setAttribute("class", "barDiv")
            barDiv.style.backgroundColor = "var(--color-secondary)"

            //optionsFromServer = {"option":value,"option":value,"option":value}
            // selected = index.target.id
            // option = val.id
            if (optionsFromServer[selected] === maxNumberOfVotes) {
                maxNumberOfVotes = maxNumberOfVotes + 1
            }

            if (maxNumberOfVotes !== 0) {
                if (selected == option) {
                    barDiv.style.width = `${((optionsFromServer[option] + 1) / maxNumberOfVotes) * 100}%`
                    barDiv.innerHTML = `<p class="barNumber">${optionsFromServer[option] + 1}</p>`
                } else {
                    barDiv.style.width = `${(optionsFromServer[option] / maxNumberOfVotes) * 100}%`
                    barDiv.innerHTML = `<p class="barNumber">${optionsFromServer[option]}</p>`
                }

            } else {
                if (selected == option) {
                    barDiv.style.width = '100%'
                    barDiv.innerHTML = `<p class="barNumber">1</p>`
                } else {
                    barDiv.style.width = '0%'
                    barDiv.innerHTML = `<p class="barNumber">${optionsFromServer[option]}</p>`
                }
            }
            console.log(`max number of votes are: ${maxNumberOfVotes}`)                   
            val.after(barDiv)              
        })
    }

    //copy address with link
    urlDiv.addEventListener('click', () => {
        navigator.clipboard.writeText(currUrl)
    })

    //copy button
    const copy = document.querySelector('.copy')
    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(currUrl)
    })
})