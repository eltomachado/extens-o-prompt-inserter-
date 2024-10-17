function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var promptFieldXPath = "/html/body/div[1]/div[2]/main/div/div/div/div[1]/div[2]/div/div/div[1]/div[2]/div[2]/div/div[1]/div[1]/div[1]/div/div[2]/div[1]";
var promptField = getElementByXPath(promptFieldXPath);

if (promptField) {
    promptField.innerText = "Este é o prompt inserido automaticamente!";
} else {
    console.log("Campo de prompt não encontrado.");
}

var runButtonXPath = "/html/body/div[1]/div[2]/main/div/div/div/div[1]/div[3]/div[1]/div[1]/div/div/div[2]/div[1]/div/div[2]/form/div[2]/div/button";
var runButton = getElementByXPath(runButtonXPath);

if (runButton) {
    runButton.click();
    console.log("Botão RUN THIS gLIF clicado.");
} else {
    console.log("Botão RUN THIS gLIF não encontrado.");
}
