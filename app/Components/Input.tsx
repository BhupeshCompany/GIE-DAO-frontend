import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInput,
  StyleSheet,
} from 'react-native';

interface IAllInputProps {
  value?: string;
  style?: StyleProp<ViewStyle>;
  Allstyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onChangeText?: (value: string) => void;
  editable?: boolean;
  keyboardType?:
    | 'numeric'
    | 'ascii-capable'
    | 'decimal-pad'
    | 'default'
    | 'email-address'
    | 'name-phone-pad'
    | 'number-pad'
    | 'numbers-and-punctuation'
    | 'phone-pad'
    | 'twitter'
    | 'url'
    | 'visible-password'
    | 'web-search';
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'characters' | 'none' | 'sentences' | 'words';
  autoCorrect?: boolean;
  lableContainer?: object;
  errorContainer?: object;
  leftContainer?: object;
  rightContainer?: object;
  maxLength?: number;
  multiline?: boolean;
}

const Input = (props: IAllInputProps) => {
  const {
    value,
    errorContainer,
    textStyle,
    style,
    onChangeText,
    onFocus,
    onBlur,
    leftContainer,
    rightContainer,
    editable,
    keyboardType,
    placeholder,
    secureTextEntry,
    autoCapitalize,
    autoCorrect,
    Allstyle,
    maxLength,
    multiline,
  } = props;
  return (
    <View style={[styles.mainHolder, Allstyle]}>
      <View
        style={[
          styles.holderStyle,
          style,
          {flexDirection: 'row', justifyContent: 'space-evenly'},
        ]}>
        {leftContainer}
        <TextInput
          style={[textStyle, {borderWidth: 0, flex: 11, color: '#fff'}]}
          onChangeText={text => onChangeText(text)}
          value={value}
          placeholder={placeholder}
          keyboardType={keyboardType ? keyboardType : 'default'}
          editable={editable != null ? editable : true}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry ? secureTextEntry : false}
          autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
          autoCorrect={autoCorrect ? autoCorrect : false}
          placeholderTextColor={'rgba(255,255,255,0.5)'}
          maxLength={maxLength ? maxLength : null}
          multiline={multiline == null ? false : true}
        />
        {rightContainer}
      </View>
      {errorContainer}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  holderStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(218,218,218,0.1)',
    borderRadius: 8,
    paddingLeft: 0,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 10,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(48, 42, 42, 0.15)',
    elevation: 16,
  },
  mainHolder: {
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    shadowColor: 'rgba(48, 42, 42, 0.25)',
    elevation: 16,
  },
});
