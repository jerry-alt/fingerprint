// getParameters(["resolution", "language", "time-zone", "platform"]) // кросс-браузерное решение
 getParameters(["canvas"]) // самый точный результат, но в пределах одного браузера
// getParameters(["resolution", "font-smoothing", "canvas", "cookie", "local-storage", "session-storage", "platform", "sub-product", "user-agent", "vendor", "app-version", "language", "languages", "connection", "plugins", "time-zone", "color-depth", "do-not-track"]) // решение для статистического анализа пользователей

/* 
Функция генерации отпечатка браузера. Возможные значения входных параметров (не чувствительна к регистру):
----- resolution: разрешение экрана
----- font-smoothing: сглаживание шрифтов
----- canvas: отрисовка браузером холста HTML5
----- cookie: включены ли cookie
----- local-storage: используется ли Locale storage.
      Хранилище LocalStorage привязано к источнику (домену, протоколу и порту) - данные хранятся,  пока их не удалит пользователь
----- session-storage: используется ли Session storage
      Хранилище SessionStorage ограничено только одной вкладкой браузера - данные хранятся, пока открыта вкладка
----- platform: платформа операционной системы (MacIntel, Win32, WebTV OS, Linux, Android)
----- sub-product: версия браузера
----- user-agent: название браузера
----- vendor: производитель браузера (Google Inc., Apple Computer, Inc.)
----- app-version: поколение браузера (4.0)
----- language: текущий язык системы 
----- languages: выбранные языки системы (массив)
----- connection: тип соединения (4G)
----- plugins: установленные плагины (массив)
----- time-zone: часовой пояс
----- color-depth: битовая глубина цифровой палитры
----- do-not-track: функция "не отслеживать"
*/
function getParameters(paratemersList) {
    let tmp = {}, hashParameters = [], hashParametersToString = ""
    for (i in paratemersList) {
        paratemersList[i] = paratemersList[i].toLowerCase()
        if (paratemersList[i] == "resolution") { tmp["Screen resolution"] = getScreenResolution() }
        else if (paratemersList[i] == "font-smoothing") { tmp["Font smoothing"] = screen.fontSmoothingEnabled }
        else if (paratemersList[i] == "canvas") { tmp["Canvas fingerprint"] = getCanvasFingerprint() }
        else if (paratemersList[i] == "cookie") { tmp["Is Cookie enabled"] = navigator.cookieEnabled }
        else if (paratemersList[i] == "local-storage") { tmp["Local storage"] = !!window.localStorage }
        else if (paratemersList[i] == "session-storage") { tmp["Session storage"] = !!window.sessionStorage }
        else if (paratemersList[i] == "platform") { tmp["Navigator platform"] = navigator.platform }
        else if (paratemersList[i] == "sub-product") { tmp["Navigator sub-product"] = navigator.productSub }
        else if (paratemersList[i] == "user-agent") { tmp["Navigator user agent"] = navigator.userAgent }
        else if (paratemersList[i] == "vendor") { tmp["Navigator vendor"] = navigator.vendor }
        else if (paratemersList[i] == "app-version") { tmp["Navigator app version"] = navigator.appVersion }
        else if (paratemersList[i] == "language") { tmp["Navigator language"] = navigator.language }
        else if (paratemersList[i] == "languages") { tmp["Navigator languages"] = navigator.languages }
        else if (paratemersList[i] == "connection") { if (navigator.connection) { tmp["Navigator connection"] = navigator.connection.effectiveType } }
        else if (paratemersList[i] == "plugins") {
            tmp["Navigator plugins"] = ""
            for (let plugin in navigator.plugins) {
                if (navigator.plugins[plugin]["name"] == undefined) {
                    break
                } else {
                    tmp["Navigator plugins"] += navigator.plugins[plugin]["name"]
                }
            }
        }
        else if (paratemersList[i] == "time-zone") { tmp["Time zone offset"] = new Date().getTimezoneOffset() }
        else if (paratemersList[i] == "color-depth") { tmp["Screen color depth"] = screen.colorDepth }
        else if (paratemersList[i] == "do-not-track") { tmp["Do not track"] = !!navigator.doNotTrack }
    }

    for (let key in tmp) {
        if (tmp[key] != undefined) {
            hashParameters.push(tmp[key])
            if (key != "Canvas fingerprint") {
                hashParametersToString += key + ":" + tmp[key] + " # "
            } else {
                hashParametersToString += key + ":" + "base64" + " # "
            }
        }
    }
    console.log(hashParametersToString)
    tmp["Hash"] = murmurhash3_32_gc(hashParameters.join('###'), 31)

    let textField = document.querySelector("#fp")
    textField.textContent = tmp["Hash"]
    textField = document.querySelector("#pa")
    textField.textContent = hashParametersToString

    document.cookie = "hash3=" + tmp["Hash"] + "; max-age=600"
    hashParametersToString = hashParametersToString.replace(/[&\/\\+()$~%.'":;*?<>{}]/g, ' ');
    document.cookie = "parameters3=" + hashParametersToString + ", max-age=600"

    return tmp
}

function getScreenResolution() {
    let resolution;
    if (this.screen_orientation) {
        resolution = (screen.height > screen.width) ? screen.height + "x" + screen.width : screen.width + "x" + screen.height;
    } else {
        resolution = screen.width + "x" + screen.height;
    }
    return resolution
}

function getCanvasFingerprint() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let txt = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-={}|[]\:"<>?;,.';
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    return canvas.toDataURL()
}

/* Функция подсчета хеша - MurmurHash
Функция не является криптографической, разработана с целью затруднения обратных операций над хешем.
Текущая версия - MurmurHash3, которая дает 32-битное или 128-битное хеш-значение https://github.com/jsdelfino/murmurhash-32
Зерно — это основа генерирования. Оно представляет собой число или вектор чисел, который мы отправляем при инициализации генератора. */
function murmurhash3_32_gc(key, seed) {
    let remainder, bytes, h1, h1b, c1, c2, k1, i;
    remainder = key.length & 3;
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;
    while (i < bytes) {
        k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(++i) & 0xff) << 8) | ((key.charCodeAt(++i) & 0xff) << 16) | ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;
        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }
    k1 = 0;
    switch (remainder) {
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= (key.charCodeAt(i) & 0xff);
            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
    }
    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;
    return h1 >>> 0;
}