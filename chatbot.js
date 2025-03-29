const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = import.meta.env.VITE_API_KEY_3;
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  //create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
}

const generateResponse= (incomingChatLi) => {
  const API_URL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  const messageElement = incomingChatLi.querySelector("p");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      contents: [{ 
        role: "user", 
        parts: [{ text: userMessage }] 
      }] 
    }),
  };


//send POST request to API , get response
  fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
    let responseText = data.candidates[0]?.content?.parts[0]?.text || "No response";
    responseText = responseText.replace(/\*/g, "");
    // messageElement.textContent = data.candidates[0].content.parts[0].text;
    messageElement.textContent = responseText;
  }).catch((error) => {
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something went wrong .Please try again.";
  }).finally(() => chatbox.scrollTo(0,chatbox.scrollHeight));
}
// messageElement.textContent = data.candidates[0].content.parts[0].text; // Update message text with API response

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if(!userMessage)return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  //Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0,chatbox.scrollHeight);

  setTimeout(() => {
    //Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming")
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0,chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  },600);
}

chatInput.addEventListener("input" ,  () => {
  //Adjust the height of the input textarea based on its content 
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown" ,  (e) => {
  //if Enter key is pressed without Shift key and the window
  //width is greater than 800px, handle the chat
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth >800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

//new
// // Check if chatbot is embedded (via query parameter)
// const urlParams = new URLSearchParams(window.location.search);
// const isEmbedded = urlParams.get('embed');

// if (isEmbedded) {
//     document.querySelector('.chatbot-toggler').style.display = 'none';
// }

// // Listen for toggle signal from parent window
// window.addEventListener('message', (event) => {
//     if (event.data === 'toggle-chatbot') {
//         document.body.classList.toggle('show-chatbot');
//         document.querySelector('.chatbot').style.display = 'block'; // Ensure chatbot is visible
//     }
// });

// // Close chatbot when close button is clicked
// chatbotCloseBtn.addEventListener("click", () => {
//     document.body.classList.remove("show-chatbot");
//     document.querySelector('.chatbot').style.display = 'none'; // Hide chatbot on close
// });

