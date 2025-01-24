import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types'; // Import types

type QuestionScreenRouteProp = RouteProp<RootStackParamList, 'QuestionScreen'>;

const QuestionScreen: React.FC = () => {
    const route = useRoute<QuestionScreenRouteProp>();
    const { testType } = route.params;

    const firstNumber = 2;
    const secondNumber = 2;

    const [num1, setNum1] = useState(Math.floor(Math.random() * firstNumber) + 1);
    const [num2, setNum2] = useState(Math.floor(Math.random() * secondNumber) + 1);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [totalAttempted, setTotalAttempted] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

    const handleAnswerSubmit = () => {
        setTotalAttempted(totalAttempted + 1);

        // Calculate correct answer based on selected test type
        let correctAnswer;
        switch (testType) {
            case 'Additions':
                correctAnswer = num1 + num2;
                break;
            case 'Subtractions':
                correctAnswer = num1 - num2;
                break;
            case 'Multiplications':
                correctAnswer = num1 * num2;
                break;
            case 'Divisions':
                correctAnswer = num1 / num2;
                break;
            case 'Tables':
                correctAnswer = num1 * num2;
                break;
            default:
                correctAnswer = num1 + num2; // Default to addition
                break;
        }

        if (userAnswer === correctAnswer.toString()) {
            setScore(score + 1);
        }

        // Generate new random numbers and avoid previously asked questions
        let newNum1, newNum2, newQuestionId;
        const maxQuestions = firstNumber * secondNumber;

        if (answeredQuestions.length >= maxQuestions) {
            Alert.alert('Congratulations! 🎉', 'You have completed the test. Great job! Keep up the good work! 💪');
            return;
        }
        do {
            newNum1 = Math.floor(Math.random() * firstNumber) + 1;
            newNum2 = Math.floor(Math.random() * secondNumber) + 1;
            newQuestionId = `${newNum1}${newNum2}`;
        } while (answeredQuestions.includes(newQuestionId));

        setNum1(newNum1);
        setNum2(newNum2);
        if (userAnswer === correctAnswer.toString()) {
            setAnsweredQuestions([...answeredQuestions, newQuestionId]);
        }
        // print answeredQuestions
        console.log(answeredQuestions);

        setUserAnswer('');
    };

    const handleReset = () => {
        setScore(0);
        setTotalAttempted(0);
        setAnsweredQuestions([]);
        setNum1(Math.floor(Math.random() * firstNumber) + 1);
        setNum2(Math.floor(Math.random() * secondNumber) + 1);
    };

    const operatorMap: { [key: string]: string } = {
        Additions: '+',
        Subtractions: '-',
        Multiplications: 'x',
        Divisions: '/',
        Tables: 'x',
    };

    return (
        <View style={styles.container}>
            <Text style={styles.question}>
                {num1} {operatorMap[testType] || '+'} {num2} = ?
            </Text>
            <TextInput
                style={styles.input}
                value={userAnswer}
                onChangeText={setUserAnswer}
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleAnswerSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <Text style={styles.score}>
                Score: {score}/{totalAttempted}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    question: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '80%',
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    score: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
});

export default QuestionScreen;