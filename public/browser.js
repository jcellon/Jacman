
function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
    <button data-identification="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-identification="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
</li>`
}

// //Initial Page Load Render
let ourHTML = items.map(function(item) {
    return itemTemplate(item)
}).join('')
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)
    
//Create Feature
let createField = document.getElementById("create-field")

document.getElementById("create-form").addEventListener("submit", function(e) {
        e.preventDefault()
        //Recycle code  
        //Send the text
        axios.post('/create-item', {text: createField.value}).then(function (response) {
            //To update list as soonest user enters text
            //Create the html for a new item
            document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
            createField.value = ""
            createField.focus()
        }).catch(function () {
            console.log("Please try again later")
        })
})

document.addEventListener("click", function(e) {
    //Delete Feature
    if (e.target.classList.contains("delete-me")) {
        if (confirm("Confirm to delete?")) {
            //Recycle code
            axios.post('/delete-item', {id: e.target.getAttribute("data-identification")}).then(function () {
                //To update list as soonest deletes
                e.target.parentElement.parentElement.remove()
            }).catch(function () {
                console.log("Please try again later")
    
            })
        }
    }

    //Update Feature
    if (e.target.classList.contains("edit-me")) {
        //1 - To test edit button
        //alert("Edit")
        //2 - create prompt and put it in a variable
        //prompt("Enter new text")
        let userInput = prompt("Enter new text:", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        //To test log
        //console.log(userInput)

        //Validate that user input is not blank with if condition
        if (userInput) {
        //Use the axios cdn with promise
        //promise is like try and catch in C#
        //Text is the object name we choose
        //Using goals instead of Id (sample)
        //axios.post('/update-item', {text: userInput, goals: e.target.getAttribute("data-goals")}).then(function () {
        axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-identification")}).then(function () {
            //To update list as soonest user enters text
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput

        }).catch(function () {
            console.log("Please try again later")
        })
            
        }

    }
})