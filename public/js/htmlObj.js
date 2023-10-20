// module1.js
export const myFunction = () => {
    return {
        landing: ` <div id="landing">
        <nav>
            <img class="logo" src="mjlogo.png" alt="">
        </nav>
        <div>
        <input type="text" id="name" placeholder="Enter your name">
        <input type="text" id="roomId" placeholder="Enter your unique room Id">
        <button id='enterChat'>Enter</button>
        </div>
    </div>`,
        chat: `
        <div >
        <form id="imgContainer" class="imgContainer" id='imgForm' action='#' >
        <img src="" alt="" id="previewImg">
        <button type='submit' id="imgSend">Send</button>
        </form>
        <canvas id="canvas" style="display: none;"></canvas>
    </div>

    <div id="chat">
        <nav>
            <img class="logo" src="mjlogo.png" alt="">
        </nav>

        <div class="container">
            <div class="message right"><img src="" alt="">
                <p>name</p>
            </div>
        </div>
        <div class="send">
            <form action='#' id="send-container">
                <p id="emojiButton">😀</p>
                <input type="text" id="messageInput" name="messageInput">
                <emoji-picker class="displayNone" id="emoji-picker-button"></emoji-picker>
                <label class="inputs-label" id="fileInputLabel" for="fileInput">📁</label>
                <input type="file" id="fileInput" hidden>
                <label class="inputs-label" id="imageInputLabel" for="imageInput">📷</label>
                <input type="file" id="imageInput" accept="image/*" hidden>
                <button type='submit' id="submit" class="btn">➡️</button>
            </form>
        </div>
    </div>
`,

    }
};
