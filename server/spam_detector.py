import pickle
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer


# Load vectorizer and model
vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
model = pickle.load(open('model.pkl', 'rb'))

# Ensure NLTK resources are available
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('omw-1.4', quiet=True)

def transform_text(text):
    """
    Preprocesses the input text:
    - Lowercases
    - Tokenizes
    - Removes stopwords and punctuation
    - Applies Lemmatization
    """
    text = text.lower()
    text = nltk.word_tokenize(text)
    
    # Keep only alphanumeric tokens
    text = [i for i in text if i.isalnum()]
    
    # Remove stopwords and punctuation
    text = [i for i in text if i not in stopwords.words('english') and i not in string.punctuation]

    lemmatizer = WordNetLemmatizer()
    text = [lemmatizer.lemmatize(i) for i in text]
    
    return " ".join(text)


def predict_spam(text):
    """
    Transforms the input text, vectorizes it, and predicts spam/ham
    """
    transformed_text = transform_text(text)
    vector_input = vectorizer.transform([transformed_text])
    result = model.predict(vector_input)[0]
    return "Spam" if result == 1 else "Not Spam"
