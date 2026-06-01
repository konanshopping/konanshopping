const express = require("express");

const router = express.Router();

const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

console.log(process.env.GEMINI_API_KEY);

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY.trim()
  );

// =========================
// KONAN AI ELITE
// =========================

router.post(
  "/chat",
  async (req, res) => {

    try {

      const {
        message,
        history,
        currentPage,
      } = req.body;

      // =====================
      // MODEL
      // =====================

      const model =
        genAI.getGenerativeModel({
          model: "gemini-1.5-flash-latest",
        });

      // =====================
      // PAGE CONTEXT
      // =====================

      let pageContext = "";

      if (currentPage === "/") {

        pageContext = `
Le client est actuellement sur la page d'accueil.
Tu peux recommander des produits tendance,
des promotions et guider le client.
`;

      }

      else if (
        currentPage === "/coupons"
      ) {

        pageContext = `
Le client regarde les coupons de réduction.
Tu dois expliquer :
- les promotions
- les réductions
- les conditions
- les expirations
`;

      }

      else if (
        currentPage === "/account"
      ) {

        pageContext = `
Le client est sur son compte.
Tu peux aider pour :
- profil
- commandes
- favoris
- paiements
- sécurité
`;

      }

      else if (
        currentPage === "/cart"
      ) {

        pageContext = `
Le client est dans son panier.
Tu dois aider à :
- finaliser la commande
- recommander des produits
- rassurer le client
`;

      }

      else if (
        currentPage === "/messages"
      ) {

        pageContext = `
Le client discute avec toi.
Tu dois parler naturellement,
comme ChatGPT.
`;

      }

      // =====================
      // MASTER PROMPT
      // =====================

      const prompt = `

Tu es Konan AI.

Tu es l'assistant intelligent officiel
du site Konan Shopping Cameroun.

Ton comportement :

- très intelligent
- moderne
- naturel
- professionnel
- amical
- utile
- rapide
- précis

Tu aides les clients à :

- trouver des produits
- choisir des produits
- comparer des produits
- comprendre les promotions
- utiliser les coupons
- suivre leurs commandes
- comprendre les paiements
- comprendre les livraisons
- découvrir les nouveautés
- discuter naturellement

IMPORTANT :

- Réponds comme ChatGPT
- Réponses naturelles
- Pas robotique
- Réponses intelligentes
- Réfléchis avant de répondre
- Réponds toujours en français
- Utilise parfois des emojis
- Sois persuasive pour vendre
- Fais des recommandations utiles

Informations du site :

- Boutique : Konan Shopping Cameroun
- Livraison : Cameroun
- Paiement : Mobile Money, Carte bancaire
- Produits : mode, électronique, accessoires, beauté, maison

Contexte de la page :
${pageContext}

Historique conversation :
${history || ""}

Question du client :
${message}

`;

      // =====================
      // GENERATION
      // =====================

      const result =
        await model.generateContent({

          contents: [

            {

              role: "user",

              parts: [
                {
                  text: prompt,
                },
              ],

            },

          ],

          generationConfig: {

            temperature: 0.95,

            topP: 1,

            topK: 40,

            maxOutputTokens: 1200,

          },

        });

      // =====================
      // RESPONSE
      // =====================

      const response =
        result.response.text();

      res.json({
        reply: response,
      });

    } catch (error) {

      console.log(error.response?.data || error);

      if (error.status === 429) {

  return res.status(429).json({
    error:
      "Konan IA est temporairement occupée. Réessayez dans 1 minute ⏳",
  });

}

res.status(500).json({
  error: "Konan IA est temporairement occupée. Réessayez dans 1 minute ⏳",
});

    }

  }
);

module.exports = router;