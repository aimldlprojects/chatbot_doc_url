import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    FlatList,
} from 'react-native';
import PDFDocument from 'react-native-pdf';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const ChatbotScreen: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [userQuestion, setUserQuestion] = useState('');
    const [url, setUrl] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const flatListRef = useRef<FlatList<Message>>(null);

    const handleFileSelect = (event: any) => {
        const file = event.nativeEvent.uri;
        setSelectedFile(file);
    };

    const handleQuestionChange = (text: string) => {
        setUserQuestion(text);
    };

    const handleUrlChange = (text: string) => {
        setUrl(text);
    };

    const handleSubmit = async () => {
        console.log('in handleSubmit');
        if (!userQuestion.trim()) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: userQuestion };
        setMessages([...messages, userMessage]);
        setUserQuestion('');

        try {
            const response = await fetch('https://60fe-2405-201-c011-e155-3537-e6f-e681-86bc.ngrok-free.app/process_query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: userQuestion,
                    user: 'user'
                }),
            });

            const data = await response.json();
            console.log(data);

            if (data.status_code === 200) {
                const assistantMessage: Message = { id: Date.now().toString(), role: 'assistant', content: data.response };
                setMessages((prevMessages) => [...prevMessages, assistantMessage]);
            } else {
                const errorMessage: Message = { id: Date.now().toString(), role: 'assistant', content: 'Error: Unable to get response from the server.' };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            const errorMessage: Message = { id: Date.now().toString(), role: 'assistant', content: 'Error: Unable to get response from the server..' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }

        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        return (
            <View style={[styles.messageContainer, item.role === 'user' && styles.userMessage]}>
                <Text style={styles.messageText}>{item.content}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chatbot</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.urlInput}
                    placeholder="Enter URL"
                    onChangeText={handleUrlChange}
                    value={url}
                />
            </View>
            {selectedFile && (
                <Text style={styles.fileName}>Selected File: {selectedFile.split('/').pop()}</Text>
            )}
            <View style={styles.fileUpload}>
                <Button title="Upload PDF" onPress={handleFileSelect} />
            </View>
            <View style={styles.chatWindow}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <TextInput
                style={styles.textInput}
                placeholder="Enter your question"
                onChangeText={handleQuestionChange}
                value={userQuestion}
                multiline={true}
            />
            <View style={styles.submitButton}>
                <Button title="Submit" onPress={handleSubmit} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    fileName: {
        marginBottom: 10,
    },
    fileUpload: {
        marginBottom: 20,
    },
    chatWindow: {
        flex: 1,
        marginBottom: 20,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    userMessage: {
        backgroundColor: '#DCF8C6',
    },
    messageText: {
        fontSize: 16,
    },
    textInput: {
        height: 100,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    submitButton: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 10,
    },
    urlInput: {
        height: 40,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
});

export default ChatbotScreen;