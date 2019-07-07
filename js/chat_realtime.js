/*****************************************************
 * #### Chat Realtime (BETA) ####
 * Coded by Ican Bachors 2016.
 * https://github.com/bachors/Chat-Realtime
 * Updates will be posted to this site.
 * Aplikasi ini akan selalu bersetatus (BETA) 
 * Karena akan terus di update & dikembangkan.
 * Maka dari itu jangan lupa di fork & like ya sob :).
 *****************************************************/
 
function ajax(method, send, callback) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    };
    xmlhttp.open(method, apis, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    if (send) {
        xmlhttp.send(send);
    } else {
        xmlhttp.send();
    }
}

// login
let userlogin;

ajax("POST", "data=cek", res => {
    const a = JSON.parse(res);

    if (a.status == 'success') {
        const x = new Date();
        const b = x.getDate();
        const c = (x.getMonth() + 1);
        const d = x.getFullYear();
        const e = x.getHours();
        const f = x.getMinutes();
        const g = x.getSeconds();
        const date = `${d}-${c < 10 ? `0${c}` : c}-${b < 10 ? `0${b}` : b} ${e < 10 ? `0${e}` : e}:${f < 10 ? `0${f}` : f}:${g < 10 ? `0${g}` : g}`;

        document.getElementsByClassName('app-one')[0].style.display = "block";
        document.getElementById("login").style.display = "none";
        document.getElementsByClassName('me')[0].src = a.avatar;
        const h = {
            name: a.user,
            avatar: a.avatar,
            login: date,
            tipe: 'login'
        };
        userRef.push(h);
        userlogin = a.user;
        document.getElementById("heading-name-meta").innerHTML = "Public";
        document.getElementById("heading-online").innerHTML = "rooms";
        chat_realtime(userRef, messageRef, apis, a.user, a.avatar, imageDir, domain)
    } else {
        document.getElementsByClassName('app-one')[0].style.display = "none";
        document.getElementById("login").style.display = "block";
    }
});

// user login
document.getElementsByClassName("form-signin")[0].onsubmit = () => {
    loginFunction()
};

function loginFunction() {
    document.getElementById("ref").innerHTML = "<center>Wait...</center>";
    const i = document.getElementById("username").value;
    const avatar = document.getElementById("avatar").value;
    if (i != '' && avatar != '') {
        ajax("POST", `data=login&name=${i}&avatar=${avatar}`, res => {
            const a = JSON.parse(res);
            if (a.status == 'success') {
                const x = new Date();
                const b = x.getDate();
                const c = (x.getMonth() + 1);
                const d = x.getFullYear();
                const e = x.getHours();
                const f = x.getMinutes();
                const g = x.getSeconds();
                const date = `${d}-${c < 10 ? `0${c}` : c}-${b < 10 ? `0${b}` : b} ${e < 10 ? `0${e}` : e}:${f < 10 ? `0${f}` : f}:${g < 10 ? `0${g}` : g}`;
                const h = {
                    name: i,
                    avatar,
                    login: date,
                    tipe: 'login'
                };
                userRef.push(h);
                window.location.href = domain;
            } else {
                document.getElementById("ref").innerHTML = "<div class='alert alert-danger'>Username sudah di pakai.</div>";
            }
        });
    } else {
        alert('Form input ada yang belum di isi')
    }
}

// user logout
document.getElementsByClassName("heading-logout")[0].addEventListener("click", () => {
    ajax("POST", "data=logout", res => {
        const a = JSON.parse(res);
        if (a.status == 'success') {
            const b = {
                name: userlogin,
                tipe: 'logout'
            };
            userRef.push(b);
            setTimeout(() => {
                window.location.href = domain;
            }, 1500);
        }
    });
});

document.getElementsByClassName("heading-compose")[0].addEventListener("click", () => {
    document.getElementsByClassName('side-two')[0].style.left = "0";
});

document.getElementsByClassName("newMessage-back")[0].addEventListener("click", () => {
    document.getElementsByClassName('side-two')[0].style.left = "-100%";
});

document.getElementsByClassName("user-back")[0].addEventListener("click", () => {
    document.getElementsByClassName('side')[0].style.display = "block";
});

var chat_realtime = (j, k, l, m, n, imageDir, domain) => {
    let allUser;
    let chatUser;
    let messages = [];
    let no = 0;
    const limit = 10;
    let uKe = 'Public';
    let uTipe = 'rooms';
    let tampungImg = [];

    let inbox = 0;
    if (inbox == 0) {
        $(".inbox-status").hide();
    }

    userMysql(({all, chat}) => {
        allUser = all;
        chatUser = chat;
        allUser.forEach(a => {
            if (a.name != m) {
                sideTwoHTML(a);
            }
        });
        if (chatUser.length > 0) {
            chatUser.forEach(a => {
                sideOneHTML(a);
            });
        }
        chatMysql('rooms', 'Public', a => {
            messages = a;
            no = 0;
            document.getElementsByClassName('messages')[0].innerHTML = "";
            if (messages.length <= limit) {
                $('#message-previous').hide();
            } else {
                $('#message-previous').show();
            }
            let opsid = 0;
            messages.forEach(a => {
                if (opsid < limit) {
                    messageHTML(messages[no]);
                    no++;
                }
                opsid++;
            });
            $('.placeholder').magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                mainClass: 'mfp-img-mobile',
                image: {
                    verticalFit: true
                }

            });
            scrollBottom();
        });
    });

    j.on("child_added", a => {
        //console.log("added", a.key, a.val());
        if (a.val().tipe == 'login') {
            if (a.val().name != m) {
                if ($(`#${a.val().name}`).length) {
                    $(`#${a.val().name} .contact-status`).removeClass('off');
                    $(`#${a.val().name} .contact-status`).addClass('on');
                    $(`#${a.val().name} .time-meta`).html(timeToWords(a.val().login))
                } else {
                    const newUser = {
                        status: "online",
                        name: a.val().name,
                        login: a.val().login,
                        avatar: a.val().avatar
                    };
                    allUser.push(newUser);
                    sideTwoHTML(newUser);
                }
            }
        } else {
            $(`#${a.val().name} .contact-status`).removeClass('on');
            $(`#${a.val().name} .contact-status`).addClass('off');
        }
        j.child(a.key).remove()
    });

    k.on("child_added", a => {
        //console.log("added", a.key, a.val());
        const b = a.val().name;

        const ke = a.val().ke;

        // inbox rooms
        if ($(`#${ke}`).data('tipe') == 'rooms') {
            if (uKe == ke) {
                messageHTML(a.val(), true);
            } else {
                inbox++;
                document.getElementsByClassName("inbox-status")[0].innerHTML = inbox;
                $(".inbox-status").show();
            }
        }

        // inbox user
        else {
            // inbox user
            if (ke == m) {
                if (!$(`.side-one #${b}`).length) {
                    const newUser = {
                        status: "online",
                        name: b,
                        date: a.val().date,
                        avatar: a.val().avatar,
                        selektor: "from"
                    };
                    chatUser.push(newUser);
                    sideOneHTML(newUser);
                }
                $(`.side-one #${b} .time-meta`).html(timeToWords(a.val().date));
                if (uKe == b) {
                    messageHTML(a.val(), true);
                    $(`.side-one #${b} .sideBar-message`).html(htmlEntities(a.val().message));
                } else {
                    let co = 1;
                    if ($(`.side-one #${b} .inbox-count`).length) {
                        co = parseInt($(`.side-one #${b} .inbox-count`).html()) + 1;
                    }
                    $(`.side-one #${b} .sideBar-message`).html(`${htmlEntities(a.val().message)} <span class="inbox-count pull-right">${co}</span>`);
                }
            }

            // send message
            else if (b == m) {
                $(`.side-one #${ke} .time-meta`).html(timeToWords(a.val().date));
                $(`.side-one #${ke} .sideBar-message`).html(`<i class="fa fa-check"></i> ${htmlEntities(a.val().message)}`);
                if (uKe == ke) {
                    messageHTML(a.val(), true);
                }
            }
        }

        $('.placeholder').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            mainClass: 'mfp-img-mobile',
            image: {
                verticalFit: true
            }

        });
        if (uKe == ke) {
            scrollBottom();
        }
        k.child(a.key).remove()
    });

    function userMysql(callback) {
        $.ajax({
            url: l,
            type: "post",
            data: 'data=user',
            crossDomain: true,
            dataType: 'json',
            success(a) {
                callback(a);
            }
        })
    }

    function chatMysql(e, f, callback) {
        $.ajax({
            url: l,
            type: "post",
            data: {
                data: 'message',
                ke: f,
                tipe: e
            },
            crossDomain: true,
            dataType: 'json',
            success(a) {
                callback(a);
            }
        })
    }

    function headingHTML(avatar, name, status) {
        document.getElementsByClassName('you')[0].src = avatar;
        document.getElementById('heading-name-meta').innerHTML = name;
        document.getElementById('heading-online').innerHTML = status;
    }

    function messageHTML(a, bottom) {
        const image = (a.image != undefined ? a.image : a.images);
        let b = "";
        if (a.name == m) {
            b += '<div class="row message-body">';
            b += '  <div class="col-sm-12 message-main-sender">';
            b += '	<div class="sender">';
            b += `      <div class="message-text">${image != '' ? `<a title="Zoom" href="${imageDir}/${image}" class="placeholder"><img class="imageDir" src="${imageDir}/${image}"/></a>` : ''}${urltag(htmlEntities(a.message))}</div>`;
            b += `      <span class="message-time pull-right">${timeToWords(a.date)}</span>`;
            b += '	</div>';
            b += '  </div>';
            b += '</div>';
        } else {
            b += '<div class="row message-body">';
            b += '  <div class="col-sm-12 message-main-receiver">';
            b += '	<div class="receiver">';
            if (uKe == "Public") {
                const sub = a.name.substring(0, 1).toLowerCase();
                let col = "EC9E74";
                const r_a = ["a", "k", "7"];
                const r_b = ["b", "m", "1", "f"];
                const r_c = ["c", "w", "3"];
                const r_d = ["d", "s", "9"];
                const r_e = ["e", "i", "0"];
                const r_f = ["t", "h", "6"];
                const r_g = ["g", "u", "2"];
                const r_h = ["p", "z", "8", "l"];
                const r_i = ["o", "x", "5"];
                const r_j = ["q", "y", "4"];
                const r_k = ["j", "v", "r"];
                if (r_a.includes(sub)) {
                    col = "dfb610";
                } else if (r_b.includes(sub)) {
                    col = "8b7add";
                } else if (r_c.includes(sub)) {
                    col = "91ab01";
                } else if (r_d.includes(sub)) {
                    col = "6bcbef";
                } else if (r_e.includes(sub)) {
                    col = "fe7c7f";
                } else if (r_f.includes(sub)) {
                    col = "e542a3";
                } else if (r_g.includes(sub)) {
                    col = "b04632";
                } else if (r_h.includes(sub)) {
                    col = "ff8f2c";
                } else if (r_i.includes(sub)) {
                    col = "029d00";
                } else if (r_j.includes(sub)) {
                    col = "ba33dc";
                } else if (r_k.includes(sub)) {
                    col = "59d368";
                }
                b += `<a class="message-username" style="color:#${col} !important">${a.name}</a>`;
            }
            b += `      <div class="message-text">${image != '' ? `<a title="Zoom" href="${imageDir}/${image}" class="placeholder"><img class="imageDir" src="${imageDir}/${image}"/></a>` : ''}${urltag(htmlEntities(a.message))}</div>`;
            b += `      <span class="message-time pull-right">${timeToWords(a.date)}</span>`;
            b += '	</div>';
            b += '  </div>';
            b += '</div>';
        }
        if (bottom != undefined) {
            $('#conversation .messages').append(b);
        } else {
            $('#conversation .messages').prepend(b);
        }
    }

    function sideOneHTML(a) {
        let b = "";
        b += `<div class="row sideBar-body" data-tipe="users" data-login="${a.date}" data-avatar="${a.avatar}" data-status="online" id="${a.name}">`;
        b += '	<div class="col-sm-3 col-xs-3 sideBar-avatar">';
        b += '  	<div class="avatar-icon">';
        b += `            <span class="contact-status ${a.status == 'online' ? 'on' : 'off'}"></span>`;
        b += `            <img src="${a.avatar}">`;
        b += '  	</div>';
        b += '	</div>';
        b += '	<div class="col-sm-9 col-xs-9 sideBar-main">';
        b += '  	<div class="row">';
        b += '			<div class="col-sm-8 col-xs-8 sideBar-name">';
        b += `                <span class="name-meta">${a.name}</span>`;
        b += '			</div>';
        b += '			<div class="col-sm-4 col-xs-4 pull-right sideBar-time">';
        b += `                <span class="time-meta pull-right">${timeToWords(a.date)}</span>`;
        b += '			</div>';
        b += '			<div class="col-sm-12 sideBar-message">';
        if (a.selektor != undefined) {
            if (a.selektor == "to") {
                b += `<i class="fa fa-check"></i> ${htmlEntities(a.message)}`;
            } else {
                b += htmlEntities(a.message);
            }
        }
        b += '  		</div>';
        b += '  	</div>';
        b += '	</div>';
        b += '</div>';
        $('.side-one .sideBar').prepend(b);
    }

    function sideTwoHTML({login, avatar, status, name}) {
        let b = "";
        b += `<div class="row sideBar-body" data-tipe="users" data-login="${login}" data-avatar="${avatar}" data-status="${status == 'online' ? 'online' : 'offline'}" id="${name}">`;
        b += '<div class="col-sm-3 col-xs-3 sideBar-avatar">';
        b += '  <div class="avatar-icon">';
        b += `    <span class="contact-status ${status == 'online' ? 'on' : 'off'}"></span>`;
        b += `    <img src="${avatar}">`;
        b += '  </div>';
        b += '</div>';
        b += '<div class="col-sm-9 col-xs-9 sideBar-main">';
        b += '  <div class="row">';
        b += '	<div class="col-sm-8 col-xs-8 sideBar-name">';
        b += `      <span class="name-meta">${name}</span>`;
        b += '	</div>';
        b += '	<div class="col-sm-4 col-xs-4 pull-right sideBar-time">';
        b += `      <span class="time-meta pull-right">${timeToWords(login)}</span>`;
        b += '	</div>';
        b += '  </div>';
        b += '</div>';
        b += '</div>';
        $('.side-two .compose-sideBar').prepend(b);
    }

    function htmlEntities(a) {
        return String(a).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }

    function urltag(d, e) {
        const f = {
            yutub: {
                regex: /(^|)(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)(\s+|$)/ig,
                template: "<iframe class='yutub' src='//www.youtube.com/embed/$3' frameborder='0' allowfullscreen></iframe>"
            },
            link: {
                regex: /((^|)(https|http|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
                template: "<a href='$1' target='_BLANK'>$1</a>"
            },
            email: {
                regex: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
                template: '<a href=\"mailto:$1\">$1</a>'
            }
        };
        const g = $.extend(f, e);
        $.each(g, (a, {regex, template}) => {
            d = d.replace(regex, template)
        });
        return d
    }

    // upload images
    function convertDataURIToBinary(dataURI) {
        const BASE64_MARKER = ';base64,';
        const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        const base64 = dataURI.substring(base64Index);
        const raw = window.atob(base64);
        const rawLength = raw.length;
        const array = new Uint8Array(new ArrayBuffer(rawLength));

        for (i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    function readMultipleImg({target}) {
        if (!$('.imagetmp').is(':visible')) {
            $('.imagetmp').css("display", "block");
        }
        //Retrieve all the files from the FileList object
        const files = target.files;

        if (files) {
            for (let i = 0, f; f = files[i]; i++) {
                if (/(jpe?g|png|gif)$/i.test(f.type)) {
                    const r = new FileReader();
                    r.onload = (({type, name, size}) => ({target}) => {
                        const base64Img = target.result;
                        const binaryImg = convertDataURIToBinary(base64Img);
                        const blob = new Blob([binaryImg], {
                            type: type
                        });
                        const x = tampungImg.length;
                        const blobURL = window.URL.createObjectURL(blob);
                        const fileName = makeid(name.split('.').pop());
                        tampungImg[x] = {
                            name: fileName,
                            type: type,
                            size: size,
                            binary: Array.from(binaryImg)
                        };
                        $('#reviewImg').append(`<img src="${blobURL}" data-idx="${fileName}" class="tmpImg" title="Remove"/>`);
                    })(f);

                    r.readAsDataURL(f);
                } else {
                    alert("Failed file type");
                }
            }
        } else {
            alert("Failed to load files");
        }
    }

    function makeid(x) {
        const d = new Date();
        let text = d.getTime();
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return `${text}.${x}`;
    }

    function scrollBottom() {
        setTimeout(() => {
            const cc = $('#conversation');
            const dd = cc[0].scrollHeight;
            cc.animate({
                scrollTop: dd
            }, 500);
            $("body .message-scroll").hide();
            $("body .message-previous").hide();
        }, 1000);
    }

    function scrollTop() {
        setTimeout(() => {
            const cc = $('#conversation');
            cc.animate({
                scrollTop: 0
            }, 500);
        }, 1000);
    }

    function timeToWords(
        time,
        lang = {
            postfixes: {
                '<': '',
                '>': ''
            },
            1000: {
                singular: 'just now',
                plural: '# seconds'
            },
            60000: {
                singular: '1 minute',
                plural: '# minutes'
            },
            3600000: {
                singular: '1 hour',
                plural: '# hours'
            },
            86400000: {
                singular: 'a day',
                plural: '# days'
            },
            31540000000: {
                singular: 'a year',
                plural: '# years'
            }
        }
    ) {
        const timespans = [1000, 60000, 3600000, 86400000, 31540000000];
        const parsedTime = Date.parse(time.replace(/\-00:?00$/, ''));

        if (parsedTime && Date.now) {
            const timeAgo = parsedTime - Date.now();
            const diff = Math.abs(timeAgo);
            const postfix = lang.postfixes[(timeAgo < 0) ? '<' : '>'];
            let timespan = timespans[0];

            for (let i = 1; i < timespans.length; i++) {
                if (diff > timespans[i]) {
                    timespan = timespans[i];
                }
            }

            const n = Math.round(diff / timespan);

            return lang[timespan][n > 1 ? 'plural' : 'singular']
                .replace('#', n) + postfix;
        }
    }

    // emojiPicker
    window.emojiPicker = new EmojiPicker({
        emojiable_selector: '[data-emojiable=true]',
        assetsPath: '//onesignal.github.io/emoji-picker/lib/img/',
        popupButtonClasses: 'fa fa-smile-o'
    });
    window.emojiPicker.discover();

    const $window = $(window);

    function checkWidth() {
        const windowsize = $window.width();
        if (windowsize > 700) {
            document.getElementsByClassName("side")[0].style.display = "block";
            $(".user-back").hide();
            $(".sideBar-body").removeClass("user-body");
        } else if (windowsize <= 700) {
            $(".user-back").show();
            $(".sideBar-body").addClass("user-body");
        }
    }
    checkWidth();
    $(window).resize(checkWidth);

    $("body").on("click", ".user-body", () => {
        document.getElementsByClassName("side")[0].style.display = "none";
    });

    //send chat
    document.getElementById("send").addEventListener("click", () => {
        const a = new Date();
        const b = a.getDate();
        const c = (a.getMonth() + 1);
        const d = a.getFullYear();
        const e = a.getHours();
        const f = a.getMinutes();
        const g = a.getSeconds();
        const date = `${d}-${c < 10 ? `0${c}` : c}-${b < 10 ? `0${b}` : b} ${e < 10 ? `0${e}` : e}:${f < 10 ? `0${f}` : f}:${g < 10 ? `0${g}` : g}`;
        const il = tampungImg.length;
        if (document.getElementById('comment').value != '') {
            ajax("POST", `data=send&name=${m}&ke=${uKe}&avatar=${n}&message=${document.getElementById('comment').value}&images=${JSON.stringify(tampungImg)}&tipe=${uTipe}&date=${date}`, res => {

                const a = JSON.parse(res);

                // insert firebase
                if (il > 0) {
                    for (hit = 0; hit < il; hit++) {
                        if (hit == 0) {
                            var i = {
                                data: 'send',
                                name: m,
                                ke: uKe,
                                avatar: n,
                                message: document.getElementById('comment').value,
                                images: tampungImg[hit].name,
                                tipe: uTipe,
                                date
                            };
                        } else {
                            var i = {
                                data: 'send',
                                name: m,
                                ke: uKe,
                                avatar: n,
                                message: '',
                                images: tampungImg[hit].name,
                                tipe: uTipe,
                                date
                            };
                        }
                        k.push(i);
                    }
                } else {
                    var i = {
                        data: 'send',
                        name: m,
                        ke: uKe,
                        avatar: n,
                        message: document.getElementById('comment').value,
                        images: '',
                        tipe: uTipe,
                        date
                    };

                    // push firebase
                    k.push(i);
                }
                tampungImg = [];
                document.getElementById('comment').value = "";
                document.getElementsByClassName('emoji-wysiwyg-editor')[0].innerHTML = "";
                document.getElementById('reviewImg').innerHTML = "";
                document.getElementsByClassName('imagetmp')[0].style.display = "none";
                scrollBottom();

            });
        } else {
            alert('Please fill atlease message!')
        }
    });

    $('body').on('click', '.side-one .sideBar-body', function() {
        const a = $(this).attr('id');
        const tipe = $(this).data('tipe');
        const av = $(this).data('avatar');
        const st = $(this).data('status');
        $('.side-one .sideBar-body').removeClass("active");
        $(this).addClass("active");
        $(`.side-one #${a} .inbox-count`).remove();
        uKe = a;
        uTipe = tipe;
        headingHTML(av, a, st);
        chatMysql(tipe, a, a => {
            messages = a;
            no = 0;
            document.getElementsByClassName('messages')[0].innerHTML = "";
            if (messages.length > limit) {
                $(".message-previous").show();
            } else {
                $(".message-previous").hide();
            }
            let opsid = 0;
            messages.forEach(a => {
                if (opsid < limit) {
                    messageHTML(messages[no]);
                    no++;
                }
                opsid++;
            });

            $('.placeholder').magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                mainClass: 'mfp-img-mobile',
                image: {
                    verticalFit: true
                }

            });
            scrollBottom();
        });
        const $window = $(window);

        function checkWidth() {
            const windowsize = $window.width();
            if (windowsize <= 700) {
                $(".side").css({
                    "display": "none"
                });
            }
        }
        checkWidth();
        $(window).resize(checkWidth);
        return false
    });

    $('body').on('click', '.side-two .sideBar-body', function() {
        messages = [];
        const a = $(this).attr('id');
        const tipe = $(this).data('tipe');
        const av = $(this).data('avatar');
        const st = $(this).data('status');
        const lg = $(this).data('login');
        uKe = a;
        uTipe = tipe;
        headingHTML(av, a, st);
        if ($(`.side-one #${a}`).length) {
            chatMysql(tipe, a, a => {
                messages = a;
                no = 0;
                document.getElementsByClassName('messages')[0].innerHTML = "";
                if (messages.length > limit) {
                    $(".message-previous").show();
                } else {
                    $(".message-previous").hide();
                }
                let opsid = 0;
                messages.forEach(a => {
                    if (opsid < limit) {
                        messageHTML(messages[no]);
                        no++;
                    }
                    opsid++;
                });
            });
        } else {
            no = 0;
            document.getElementsByClassName('messages')[0].innerHTML = "";
            $(".message-previous").hide();
            const newUser = {
                status: st,
                name: a,
                date: lg,
                avatar: av
            };
            chatUser.push(newUser);
            sideOneHTML(newUser);
        }
        $('.side-one .sideBar-body').removeClass("active");
        $(`.side-one #${a}`).addClass("active");

        $('.placeholder').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            mainClass: 'mfp-img-mobile',
            image: {
                verticalFit: true
            }

        });
        scrollBottom();
        document.getElementsByClassName('side-two')[0].style.left = "-100%";
        return false
    });

    $('body').on('click', '.message-username', function() {
        messages = [];
        const a = $(this).html();
        const tipe = $(`body .side-two #${a}`).data('tipe');
        const av = $(`body .side-two #${a}`).data('avatar');
        const st = $(`body .side-two #${a}`).data('status');
        const lg = $(`body .side-two #${a}`).data('login');
        uKe = a;
        uTipe = tipe;
        headingHTML(av, a, st);
        if ($(`.side-one #${a}`).length) {
            chatMysql(tipe, a, a => {
                messages = a;
                no = 0;
                document.getElementsByClassName('messages')[0].innerHTML = "";
                if (messages.length > limit) {
                    $(".message-previous").show();
                } else {
                    $(".message-previous").hide();
                }
                let opsid = 0;
                messages.forEach(a => {
                    if (opsid < limit) {
                        messageHTML(messages[no]);
                        no++;
                    }
                    opsid++;
                });
            });
        } else {
            no = 0;
            document.getElementsByClassName('messages')[0].innerHTML = "";
            $(".message-previous").hide();
            const newUser = {
                status: st,
                name: a,
                date: lg,
                avatar: av
            };
            chatUser.push(newUser);
            sideOneHTML(newUser);
        }
        $('.side-one .sideBar-body').removeClass("active");
        $(`.side-one #${a}`).addClass("active");

        $('.placeholder').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            mainClass: 'mfp-img-mobile',
            image: {
                verticalFit: true
            }

        });
        scrollBottom();
        document.getElementsByClassName('side-two')[0].style.left = "-100%";
        return false;
    });

    document.getElementsByClassName("previous")[0].addEventListener("click", () => {
        let opsid = 0;
        messages.forEach(a => {
            if (opsid < limit) {
                messageHTML(messages[no]);
                no++;
                scrollTop();
                if (no >= messages.length) {
                    $(".message-previous").hide();
                }
            }
            opsid++;
        });

        $('.placeholder').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            mainClass: 'mfp-img-mobile',
            image: {
                verticalFit: true
            }

        });
        return false
    });

    document.getElementById("scroll").addEventListener("click", () => {
        const cc = $('#conversation');
        const dd = cc[0].scrollHeight;
        cc.animate({
            scrollTop: dd
        }, 500);
        return false
    });

    $('body').on('click', '.heading-home', function() {
        uKe = $(this).attr("id");
        uTipe = $(this).data("tipe");
        headingHTML($(this).data("avatar"), uKe, uTipe);
        inbox = 0;
        $(".inbox-status").hide();
        $('.side-one .sideBar-body').removeClass("active");
        chatMysql('rooms', 'Public', a => {
            messages = a;
            no = 0;
            document.getElementsByClassName('messages')[0].innerHTML = "";
            if (messages.length <= limit) {
                $(".message-previous").hide();
            } else {
                $(".message-previous").show();
            }
            let opsid = 0;
            messages.forEach(a => {
                if (opsid < limit) {
                    messageHTML(messages[no]);
                    no++;
                }
                opsid++;
            });

            $('.placeholder').magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                mainClass: 'mfp-img-mobile',
                image: {
                    verticalFit: true
                }

            });
            scrollBottom();
        });
        const $window = $(window);

        function checkWidth() {
            const windowsize = $window.width();
            if (windowsize <= 700) {
                document.getElementsByClassName("side")[0].style.display = "none";
            }
        }
        checkWidth();
        $(window).resize(checkWidth);
        return false
    });

    $('body').on('keydown', '#searchText', () => {
        setTimeout(() => {
            if (document.getElementById("searchText").value == "") {
                $("body .side-one .sideBar-body").show();
            } else {
                $("body .side-one .sideBar-body").hide();
                $("body .side-one .sideBar-body").each((i, a) => {
                    const key = $("body .side-one .sideBar-body").eq(i).attr('id');
                    const reg = new RegExp(document.getElementById("searchText").value, 'ig');
                    const res = key.match(reg);
                    if (res) {
                        $("body .side-one .sideBar-body").eq(i).show();
                    }
                });
            }

        }, 50);
    });

    $('body').on('keydown', '#composeText', () => {
        setTimeout(() => {
            if (document.getElementById("composeText").value == "") {
                $("body .side-two .sideBar-body").show();
            } else {
                $("body .side-two .sideBar-body").hide();
                $("body .side-two .sideBar-body").each((i, a) => {
                    const key = $("body .side-two .sideBar-body").eq(i).attr('id');
                    const reg = new RegExp(document.getElementById("composeText").value, 'ig');
                    const res = key.match(reg);
                    if (res) {
                        $("body .side-two .sideBar-body").eq(i).show();
                    }
                });
            }

        }, 50);
    });

    $('body').on('click', '.tmpImg', function() {
        const k = $(this).data('idx');
        tampungImg = tampungImg.filter(({name}) => name !== k);
        $(this).remove();
        if (tampungImg.length < 1) {
            document.getElementsByClassName('.imagetmp')[0].style.display = "none";
        }
        return false;
    });


    $("body #conversation").scroll(function() {
        // scroll bottom
        if ($(this).scrollTop() >= ($("body .messages").height() - $(this).height())) {
            $("body .message-scroll").hide();
            $("body .message-previous").hide();
            return false;
        } else if ($(this).scrollTop() == 0) {
            if (no >= messages.length) {
                $("body .message-previous").hide();
            } else {
                $("body .message-previous").show();
            }
            return false;
        } else {
            $("body .message-previous").hide();
            $("body .message-scroll").show();
            return false;
        }
    });

    document.getElementById('fileinput').addEventListener('change', readMultipleImg, false);
}
