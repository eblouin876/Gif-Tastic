// Object templates
class Gif {
    constructor(rating, activeLink, inactiveLink, title, download) {
        this.rating = rating;
        this.activeLink = activeLink;
        this.inactiveLink = inactiveLink;
        this.title = title;
        this.download = download;
    }

    buildCard = (parentId, fav) => {
        let favorite;
        let card = $('<div>')
            .addClass('card m-2 w-5')
            .attr('style', 'width: 45%; float: left')
        let img = $('<img>')
            .attr('src', this.inactiveLink)
            .addClass('card-img-top')
            .attr('alt', this.title)
            .attr('data-active', this.activeLink)
            .attr('data-inactive', this.inactiveLink)
            .attr('data-state', 'inactive');
        let body = $('<div>')
            .addClass('card-body text-center');
        let cardTitle = $('<h5>')
            .addClass('card-title')
            .text(this.title);
        let cardText = $('<p>')
            .addClass('card-text')
            .text('Rating: ' + this.rating);
        if (fav) {
            favorite = $('<button>')
                .text("Remove")
                .attr('data-ref', this.title)
                .addClass("btn btn-danger remove-favorites")
        } else {
            favorite = $('<button>')
                .addClass('btn btn-primary add-favorites')
                .attr('data-ref', this.title)
                .text('Add to Favorites')
        }
        $(`#${parentId}`).append(card.append(img, body.append(cardTitle, cardText, favorite)));
    }
}

class Subject {
    constructor(subject) {
        this.subject = subject;
    }

    buildButton = (parentId) => {
        let title = this.subject;
        let button = $('<button>')
            .text(title)
            .addClass('subject m-2 btn btn-success w-75')
        $(`#${parentId}`).append(button)
    }
}


// Predetermined subjects
let subjects = ["Cats", "Dogs", "Turtles", "Fish", "Goats", "Llamas", "Birds", "Snakes", "Lizards"];
let subjectButtons = [];
let gifs = {};


// Functions for event listeners
let trigger = function () {
    if ($(this).attr('data-state') === 'inactive') {
        $(this).attr('src', $(this).attr('data-active'));
        $(this).attr('data-state', 'active');
    } else {
        $(this).attr('src', $(this).attr('data-inactive'));
        $(this).attr('data-state', 'inactive');
    }
}

let getGifs = function () {
    let search = $(this).text()
    let rand = Math.floor(Math.random() * 150)
    $.ajax({
        url: `https://api.giphy.com/v1/gifs/search?q=${search}&rating=g&offset=${rand}&api_key=V5ocWl5KK3sMT5VrH2fFjEVoaCuVfUru&limit=10`,
        success: (result) => {
            let data = result.data;
            data.forEach(element => {
                let active = element.images.fixed_width.url;
                let inactive = element.images.fixed_width_still.url;
                let rating = element.rating;
                let title = element.title;
                let download = element.images.original.url;

                let gif = new Gif(rating, active, inactive, title, download);
                gif.buildCard("main-box");
                gifs[title] = gif;
            });

        }
    })
}

let addSubject = () => {
    if ($("#topicAddOn").val()) {
        let newSubject = $("#topicAddOn").val()
        subjects.unshift(newSubject)
        $("#topicAddOn").val("")
        build(subjects)
    }
}

let clearField = function () {
    $("#main-box").empty()
}

let build = function (topics) {
    $("#buttons-box").empty()
    topics.forEach(element => {
        let button = new Subject(element)
        button.buildButton("buttons-box")
        subjectButtons.push(button)
    });
}

let addFavorite = function () {
    localStorage.setItem($(this).attr('data-ref'), JSON.stringify(gifs[$(this).attr('data-ref')]))
}

let buildFavorites = function () {
    $("#modal-favorites").empty()
    let keys = Object.keys(localStorage)
    keys.forEach(function (key) {
        let archive = JSON.parse(localStorage.getItem(key))
        let obj = new Gif(archive.rating, archive.activeLink, archive.inactiveLink, archive.title, archive.download)
        obj.buildCard("modal-favorites", "fav")
    })
}

let removeFavorite = function () {
    localStorage.removeItem($(this).attr('data-ref'), JSON.stringify(gifs[$(this).attr('data-ref')]))
    buildFavorites()
}


// Event listeners

$(document).ready(build(subjects))

$(document).on('click', 'img', trigger);

$(document).on('click', '.subject', getGifs);

$(document).on('click', '#button-addon2', addSubject)

$(document).on('click', '#clear', clearField)

$(document).on('click', '.add-favorites', addFavorite)

$(document).on('click', '.remove-favorites', removeFavorite)

$(document).on('click', '#favorites-button', buildFavorites)

$("#topicAddOn").keyup((event) => {
    if (event.key === "Enter") {
        addSubject()
    }
})