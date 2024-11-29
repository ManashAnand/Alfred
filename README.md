# Alfred - Build Your Own Chatbot

**Alfred** is an intuitive platform designed to empower anyone, regardless of their AI expertise, to create a personalized chatbot effortlessly. This project offers a suite of features to save conversations, share chatbot projects on social media, and even integrate a resume-viewing UI.


## 📸 Screenshots

![Alfred Screenshot 1](https://github.com/user-attachments/assets/b223cc28-8ec4-42af-aaac-9274586aed56)
![Alfred Screenshot 2](https://github.com/user-attachments/assets/008ff84d-00f3-42ad-b036-0e4f1912c4b8)

---

## 🎥 Working Video

Check out the working demo of Alfred on Twitter:

[View the video here](https://x.com/manashanand2/status/1856652531675369753)


---

## ✨ Features

- **No AI Expertise Needed**: Create your chatbot with zero coding or AI knowledge.
- **Save Conversations**: Store and manage conversations for later use.
- **Social Media Integration**: Share your chatbot projects via Twitter, WhatsApp, and more.
- **Resume Viewer**: An integrated UI to showcase resumes provided by users.
- **Live Demo**: Experience the platform at [Alfred Live](https://alfred-tau.vercel.app/).

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or Yarn

### Steps to Install

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ManashAnand/Alfred.git
   cd Alfred
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Build the Project**:
   ```bash
   npm run build
   ```

5. **Start the Production Server**:
   ```bash
   npm start
   ```

---

## 🛠️ Development

### Running in Development Mode
To test changes locally, use the following command:
```bash
npm run dev
```

This starts a local development server and watches for file changes.

---

## 📁 Project Structure

```plaintext
Alfred/
├── api/                    # added feed button (3 weeks ago)
├── app/                    # resolve tags issue and made a new API for getting the latest user (3 weeks ago)
├── components/             # added share button for Alfred (3 weeks ago)
├── hooks/                  # added tags using dynamic (last month)
├── lib/                    # added tags using dynamic (last month)
├── public/                 # added tags using dynamic (last month)
├── utils/
│   └── supabase/           # added tags using dynamic (last month)
├── .dockerignore           # added docker file (3 weeks ago)
├── .eslintrc.json          # added tags using dynamic (last month)
├── .gitignore              # added tags using dynamic (last month)
├── Dockerfile              # added feed button (3 weeks ago)
├── LICENSE                 # added tags using dynamic (last month)
├── README.md               # added tags using dynamic (last month)
├── components.json         # added tags using dynamic (last month)
├── middleware.ts           # added tags using dynamic (last month)
├── next.config.js          # added tags using dynamic (last month)
├── package-lock.json       # added share button for Alfred (3 weeks ago)
├── package.json            # added share button for Alfred (3 weeks ago)
├── postcss.config.js       # added tags using dynamic (last month)
├── requirements.txt        # added rate limiter with 5 min per request (3 weeks ago)
├── tailwind.config.js      # added tags using dynamic (last month)
└── tsconfig.json           # added tags using dynamic (last month)
└── vercel.json             # added vercel.json to remove extra dependency
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Create a Pull Request.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📞 Support

If you encounter any issues or have questions, feel free to open an [issue](https://github.com/ManashAnand/Alfred/issues) or reach out.

---

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Hosted on [Vercel](https://vercel.com/)
