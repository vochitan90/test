/* eslint-disable-next-line no-unused-vars */
APP_CONFIG = {
  MERGE_ELECTRIC_DIGITAL: 'http://113.61.108.198:9121/mergeElectricDigital',
}
isFirstLoad = true;
dataMessage = null;
_appState = null;
PERMISSION = null;
UPLOAD_PUBLISH_DOC_TEPM = '';
DOWNLOAD_PUBLISH_DOC_TEMP = '';
COUNT_INTERVAL = 0;
IS_LOAD_FILE_COMPLETE = false;
GET_RECEIVER_ATTACT_DETAIL = '';
TYPE_ACTION = '';
TOKEN = '';
CONTRACT = '';
if (window.location.href.indexOf("localhost") > -1) {
  // _PATH = window.origin + "/assets/pdf/lib";
  _PATH = '../lib';
  _initialDoc = 'files/demo.pdf';
  _imagefile = '../assets/check.png';
} else {
  TOKEN = location.search.split('token=')[1];
  CONTRACT = location.search.split('contract=')[1];
  // _PATH = window.origin + "/assets/pdf/lib";
  _PATH = '../lib';
  _initialDoc = 'files/demo.pdf';
  _imagefile = "assets/check.png";
}

function samplesSetup(instance) {
  instance.disableElements(ELEMENTS_BUTTON_PDFTRON);
}

async function saveDocument() {
  // must wait for the document to be loaded before you can save the file
  const list = window.annotManager.getAnnotationsList();
  list.forEach(item => {
    item.ReadOnly = true
  });

  const xfdfString = await window.annotManager.exportAnnotations({
    links: false
  });
 
  const documentStream = await window.docViewer.getDocument().getFileData({});
  const documentBlob = new Blob([documentStream], {
    type: 'application/pdf'
  });

  const formData = new FormData();
  formData.append("file", documentBlob);
  formData.append("xfdf", xfdfString);
  axios
    .post(APP_CONFIG.MERGE_ELECTRIC_DIGITAL, formData, {
      responseType: 'blob'
    })
    .then((response) => {
      if (response) {
        if (response.status === 200) {
          // const fileName = new Date().getTime() + ".pdf";
          // const blob = response.data;
          // const url = window.URL.createObjectURL(blob);
          // const anchorElem = document.createElement("a");
          // anchorElem.style = "display: none";
          // anchorElem.href = url;
          // anchorElem.download = fileName;
          // document.body.appendChild(anchorElem);
          // anchorElem.click();
          // document.body.removeChild(anchorElem);
          // setTimeout(function () {
          //   window.URL.revokeObjectURL(url);
          // }, 300);
        } else {
          window.showMessage('Không thể lấy thôn tin file');
        }
      }
      IS_LOAD_FILE_COMPLETE = true;
      console.log("SUCCESS!! ", response);
    })
    .catch((err) => {
      IS_LOAD_FILE_COMPLETE = true;
      console.log("FAILURE!! ", err);
    });
}


function showMessage(message, type) {
  let snackbar = document.getElementById('snackbar');
  if (type === 'error') {
    snackbar = document.getElementById('snackbarError');
  }
  if (snackbar) {
    snackbar.innerHTML = message;
    snackbar.className = 'show';
    setTimeout(() => {
      snackbar.className = snackbar.className.replace('show', '');
    }, 3000);
  }
}

function generateUUID() {
  try {
    let d = new Date().getTime();
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  } catch (e) {
    // console.log(e);
  }
}


function checkIsString(str) {
  return typeof (str) === 'string' || str instanceof String;
}

function isShowSignUSB() {
  return false;
}

function showModal() {
  var overlayPdfTronApp = document.getElementById('overlayPdfTronApp');
  if (overlayPdfTronApp) {
    overlayPdfTronApp.style.display = 'table';
  }
}


function hideModal() {
  var overlayPdfTronApp = document.getElementById('overlayPdfTronApp');
  if (overlayPdfTronApp) {
    overlayPdfTronApp.style.display = 'none';
  }
}

function getAppState() {
  let appState = sessionStorage.getItem('APP_STATE');
  if (appState) {
    appState = JSON.parse(appState);
  }
}

function isHideModal() {
  var overlayPdfTronApp = document.getElementById('overlayPdfTronApp');
  if (overlayPdfTronApp) {
    if (overlayPdfTronApp.style.display === 'none') {
      return false;
    }
  }
  return true;
}

function getIframeModal() {
  var iframe = $('iframe');
  if (iframe) {
    var contentDocument = iframe.contentDocument;
    return contentDocument;
  }
  return null;
}

function getDetailService(dataParam) {
  const urlGetDetailService = GET_RECEIVER_ATTACT_DETAIL;
  const params = `receiverId=${dataParam.receiverId}&attactId=${dataParam.attachmentId}`;
  return axios
    .post(urlGetDetailService, params, {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset:UTF-8",
        authorization: "Bearer " + sessionStorage.getItem("Authorization"),
        responseType: 'json'
      },
    })
}

function fireEventToParent(action, host) {
  window.parent.postMessage(action, host);
}


ACTION_EVENT_PDFTRON = {
  'LOAD_LIST_FILE': 'LOAD_LIST_FILE',
  'LOAD_FILE': 'LOAD_FILE',
  'CHANGE_FILE': 'change-file',
  'RECEIVE_FILE_COMPLETE': 'RECEIVE_FILE_COMPLETE',
  'LOAD_FILE_AGAIN': 'LOAD_FILE_AGAIN',
  'TRIGGER_LOAD_FILE': 'TRIGGER_LOAD_FILE',
  'CHANGE_CONTENT_FILE': 'CHANGE_CONTENT_FILE',
  'POP_UP': 'POP_UP'
}

ELEMENTS_BUTTON_PDFTRON = ['selectToolButton', 'menuButton', 'miscToolGroupButton', 'freeHandToolGroupButton',
  'textToolGroupButton', 'shapeToolGroupButton', 'eraserToolButton', 'freeTextToolButton',
  // 'signatureToolButton',
  'stickyToolButton', 'eraserToolButton', 'searchButton', 'redactionButton', 'rubberStampToolButton'
];