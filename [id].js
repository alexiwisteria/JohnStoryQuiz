import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import story from '../../data/story.json';
import Question from '../../components/Question';

const QuizPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isVisible, setIsVisible] = useState(true);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        if (id) {
            setIsVisible(true);
            setCurrentId(parseInt(id));
        }
    }, [id]);

    // Find the current step in the story
    const currentStep = story.find((q) => q.id === currentId);

    const handleNavigation = async (nextId) => {
        setIsVisible(false); // Start transition effect
        await new Promise(resolve => setTimeout(resolve, 300)); // Wait for transition
        if (nextId === 10) {
            router.push(`/quiz/${nextId}`); // Ensure proper navigation to reflection
        } else {
            router.push(`/quiz/${nextId}`);
        }
    };

    if (!currentStep) {
        return <div>Loading...</div>;
    }

    // If the current step is the ending
    if (currentStep.ending) {
        return (
            <div style={{
                textAlign: 'center',
                margin: '50px',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease'
            }}>
                <h1>{currentStep.ending.title}</h1>
                <p style={{ fontSize: '18px', margin: '20px 0', lineHeight: '1.6' }}>
                    {currentStep.ending.message}
                </p>
                <button
                    onClick={() => handleNavigation(1)} // Restart button
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                >
                    Restart Game
                </button>
            </div>
        );
    }

    // If the current step is a result
    if (currentStep.result) {
        return (
            <div style={{
                textAlign: 'center',
                margin: '50px',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease'
            }}>
                <h1>{currentStep.result}</h1>
                <p style={{ fontStyle: 'italic', margin: '20px 0', fontSize: '18px' }}>
                    <strong>{currentStep.scripture.text}</strong>
                </p>
                <p style={{ fontSize: '14px', color: '#555' }}>
                    {currentStep.scripture.reference}
                </p>
                <button
                    onClick={() => handleNavigation(10)} // Continue to Reflection button
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                >
                    Continue to Reflection
                </button>
            </div>
        );
    }

    // Render the question step
    return (
        <div style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease'
        }}>
            <Question
                question={currentStep.question}
                scripture={currentStep.scripture}
                options={currentStep.options}
                onNavigate={handleNavigation}
            />
        </div>
    );
};

export default QuizPage;
