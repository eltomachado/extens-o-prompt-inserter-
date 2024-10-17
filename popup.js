document.getElementById('insert').addEventListener('click', () => {
    const prompts = document.getElementById('prompt').value.split('\n').filter(prompt => prompt.trim() !== '');
    let currentPromptIndex = 0;

    function processPrompt() {
        if (currentPromptIndex >= prompts.length) {
            console.log('Todos os prompts foram processados.');
            return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (prompt) => {
                    function getElementByXPath(xpath) {
                        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    }

                    const promptFieldXPath = "/html/body/div[1]/div[2]/main/div/div/div/div[1]/div[2]/div/div/div[1]/div[2]/div[2]/div/div[1]/div[1]/div[1]/div/div[2]/div[1]";
                    const promptField = getElementByXPath(promptFieldXPath);

                    if (promptField) {
                        promptField.innerText = prompt;
                    }
                },
                args: [prompts[currentPromptIndex]]
            }, () => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        function getElementByXPath(xpath) {
                            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        }

                        const runButtonXPath = "/html/body/div[1]/div[2]/main/div/div/div/div[1]/div[3]/div[1]/div[1]/div/div/div[2]/div[1]/div/div[2]/form/div[2]/div/button";
                        const runButton = getElementByXPath(runButtonXPath);

                        if (runButton) {
                            runButton.click();
                        }
                    }
                });

                setTimeout(() => {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: () => {
                            function getElementByXPath(xpath) {
                                return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            }

                            const imageXPath = "/html/body/div[1]/div[2]/main/div/div/div/div[1]/div[3]/div[1]/div[1]/div/div/div[2]/div[1]/div/div[1]/div/div/img";
                            const imageElement = getElementByXPath(imageXPath);

                            if (imageElement) {
                                return imageElement.src;
                            } else {
                                return null;
                            }
                        }
                    }, (result) => {
                        const imageUrl = result[0].result;
                        if (imageUrl) {
                            fetch(imageUrl)
                                .then(response => response.blob())
                                .then(blob => {
                                    const url = URL.createObjectURL(blob);
                                    chrome.downloads.download({
                                        url: url,
                                        filename: `image_${currentPromptIndex + 1}.png`
                                    });
                                })
                                .catch(error => console.error('Erro ao baixar a imagem:', error));
                        }
                    });

                    currentPromptIndex++;
                    processPrompt();
                }, 10000);
            });
        });
    }

    processPrompt();
});
