const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage = null; // Store user's message
const API_KEY = "YOUR_HUGGINGFACE_API_KEY"; // Replace with your Hugging Face API key
const MODEL = "mistralai/Mistral-7B-Instruct"; // Choose an AI model
const API_URL = `https://api-inference.huggingface.co/models/${MODEL}`;
const inputInitHeight = chatInput.scrollHeight;

// Function to create chat message elements
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  chatLi.innerHTML = className === "outgoing"
    ? `<p></p>`
    : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

// Function to call Hugging Face API and generate response
const generateResponse = (incomingChatli) => {
  const messageElement = incomingChatli.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: userMessage,
      parameters: { max_new_tokens: 100, return_full_text: false }
    })
  };

  // Send request to Hugging Face API
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      const reply = data[0]?.generated_text || "Sorry, I couldn't understand that.";
      messageElement.textContent = reply;
    })
    .catch(() => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

// Function to handle user input and send message
const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append user message to chatbox
  const outgoingChatli = createChatLi(userMessage, "outgoing");
  chatbox.appendChild(outgoingChatli);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Display "Typing..." message while waiting for the response
    const incomingChatli = createChatLi("Typing...", "incoming");
    chatbox.appendChild(incomingChatli);
    generateResponse(incomingChatli);
  }, 600);
};

// Auto-expand textarea on input
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Handle sending messages when Enter is pressed
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatbtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));