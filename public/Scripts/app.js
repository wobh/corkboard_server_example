// app.js

function isInteger (n) {
    return typeof n === "number" && n % 1 === 0;
};

function isString (s) {
    return typeof s === "string";
};

function valueOrUndefinedOrError (value, check) {
    if (typeof value === "undefined" || check.call(undefined, value)) {
	return value;
    } else {
	throw new Error("Not a valid input value: " + value);
    }
};

function Note (subject, content, id) {
    this.base_url = "/note";
    this.subject = valueOrUndefinedOrError(subject, isString);
    this.content = valueOrUndefinedOrError(content, isString);
    this.id      = valueOrUndefinedOrError(id, isInteger);
};

Note.prototype.url = function() {
    if (isInteger(this.id)) {
	return this.base_url + "/" + this.id;
    } else {
	return this.base_url;
    };
};

Note.prototype.toJSON = function() {
    var this_note = {"subject": this.subject, "content": this.content};
    if (isInteger(this.id)) {
	this_note.id = this.id;
    }
    return JSON.stringify(this_note);
};

Note.prototype.toKeyValStr = function() {
    return "id: " + this.id + ", subject: " + this.subject + ", content: " +this.content;
};

Note.prototype.toValStr = function() {
    return this.id + ", " + this.subject + ", " + this.content;
};

Note.prototype.fetch = function () {
    $.ajax({
	url: this.url(),
	dataType: "json",
	success: function (data) {
	    this.subject = data.subject;
	    this.content = data.content;
	    console.log(this); },
	context: this
    });
};

var my_note = new Note(undefined, undefined, 1);

my_note.fetch();

Note.prototype.save = function () {
    var http_method;
    if (isInteger(this.id)) {
	http_method = "POST";
    } else {
	http_method = "PUT";
    };
    $.ajax({
	url: this.url(),
	dataType: "json",
	data: this.JSON(),
	success: function (data) {
	    console.log(data);
	},
	type: http_method,
	context: this
    });
};

Note.prototype.destroy = function () {
    // TODO
    $.ajax({
	url: this.url(),
	dataType: "json",
	data: this.toJSON(),
	success: function () {},
	type: "DELETE",
	context: this
    });
}; // FIXME: I don't know if this works!

var n = new Note("Marvin", "Depressed Android.", 10);

n.save();

// var mediator = {};
// mediator.addEventListener('Note: fetched', refresh); // ?
