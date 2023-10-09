// module1.js
export const myFunction = () => {
    return {
        landing: ` <div id="landing">
        <nav>
            <img class="logo" src="mjlogo.png" alt="">
        </nav>
        <input type="text" id="name" placeholder="Enter your name">
        <input type="text" id="roomId" placeholder="Enter your unique room Id">
        <button id='enterChat'>Enter</button>
    </div>`,
        chat: `<div id="chat" >
    <nav>
        <img class="logo" src="mjlogo.png" alt="">
    </nav>

    <div class="container">
    </div>
    <div class="send">
        <form action='#'  id="send-container">
        <p id="emojiButton">😀</p>
            <input type="text" id="messageInput" name="messageInput">
            <emoji-picker class="displayNone" id="emoji-picker-button"></emoji-picker>
            <button type='submit' id="submit" class="btn">Send</button>
        </form>
    </div>
</div>
`,

    }
};
