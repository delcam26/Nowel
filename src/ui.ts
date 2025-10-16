import { Contact } from "./data"

const chat = document.getElementById("game") as HTMLDivElement

export function showMessage(from: Contact, text: string) {
  const messageDiv = document.createElement("div")
  messageDiv.className = "message"

  const avatar = document.createElement("img")
  avatar.src = from.avatar
  avatar.alt = from.name
  avatar.className = "avatar"

  const bubble = document.createElement("div")
  bubble.className = "bubble"
  bubble.style.backgroundColor = from.color
  bubble.textContent = text

  messageDiv.appendChild(avatar)
  messageDiv.appendChild(bubble)

  chat.appendChild(messageDiv)

  // Scroll automatique vers le bas
  chat.scrollTop = chat.scrollHeight
}