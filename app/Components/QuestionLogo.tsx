import React from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface IAllQuestionProps {
  onTouchField?: () => void;
}

const QuestionLogo = (props: IAllQuestionProps) => {
  const {onTouchField} = props;

  return (
    <TouchableOpacity
      onPress={() => {
        onTouchField();
      }}>
      <AntDesign name="questioncircleo" style={styles.questioncircleoStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  questioncircleoStyle: {
    color: '#fff',
    fontSize: Platform.OS === 'android' ? 20 : 22,
    padding: 10,
  },
});

export default QuestionLogo;
