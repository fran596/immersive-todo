import uuidv1 from 'uuid'
import EventEmitter from 'events'

// we create an instance of EventEmitter to emit and
// listen to events
const bus = new EventEmitter
var yo = require('yo-yo')

var toDos = [] // start empty 
var el = list(toDos, update)

function list(items, onclick) {
    return yo`<div>
    <h1>Things ToDo:</h1>
    <input type="text" id="todoVal">
    <button onclick=${onclick} class="button-secondary pure-button">Add Todo</button>
    <ul id="listNotDone">
      ${items.map(function (item) {
            if (item.status === "pending") {
                return retItem(item)
            }
        })}
    </ul>
    <h1>Done:</h1>
    <ul id="listDone">
    ${items.map(function (item) {
            if (item.status === "done") {
                return retItem(item)
            }
        })}
    </ul>
  </div>`
}

function update() {
    // add a new TODO for the list 
    let task = {};
    task.id = uuidv1();
    task.value = document.getElementById("todoVal").value;
    task.status = 'pending';
    toDos.push(task)
    // construct a new list and efficiently diff+morph it into the one in the DOM 
    var newList = list(toDos, update)
    yo.update(el, newList)
}

function retItem(item) {
    if (item.status === "pending") {
        return yo`<li id="${item.id}">${item.value}<button onclick=${isDone} class="button-secondary pure-button">Mark as done</button></li>`
    }
    else {
        return yo`<li id="${item.id}">${item.value}<button onclick=${isDone} class="button-secondary pure-button">Undo</button></li></li>`
    }
}

function isDone(ev) {
    var id = ev.target.parentNode.getAttribute('id')
    toDos = toDos.filter(function (el, i) {
        if (id !== el.id) {
            return id
        }
        else {
            if (el.status === "done") {
                el.status = 'pending'
            }
            else {
                el.status = 'done'
            }

            return id;
        }
    });
    ev.target.parentNode.remove();
    console.table(toDos);
    var newList = list(toDos, update)
    yo.update(el, newList)
}


document.body.appendChild(el)