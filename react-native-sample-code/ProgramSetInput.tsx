import React from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { theme } from '@influence/theme'

type Props = {
  value: string
  label: string
  status: string
  valueKey: string
  nativeID?: string
  formKey?: string
  onNext?: () => void
  onUpdate?: (key: string, value: string) => void
}

export interface InputRef {
  focus: () => void
}

export const ProgramSetInput = React.forwardRef<InputRef, Props>(
  (
    {
      value,
      label,
      status,
      valueKey,
      onNext = undefined,
      nativeID = undefined,
      onUpdate = undefined,
    },
    ref
  ) => {
    const input = React.useRef<TextInput>()
    const borderColor =
      status === 'complete' ? theme.colors.green : 'rgba(151,151,151,0.2)'

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        if (input.current) {
          input.current.focus()
        }
      },
    }))

    return (
      <View style={[styles.container, { borderColor }]}>
        <View style={styles.valueContainer}>
          {onUpdate !== undefined && (
            <TextInput
              ref={input}
              value={value}
              placeholder="--"
              style={[styles.value]}
              // keyboardType="numeric"
              selectTextOnFocus={true}
              onSubmitEditing={onNext}
              placeholderTextColor="#FFFFFF"
              inputAccessoryViewID={nativeID}
              onChangeText={text => onUpdate(valueKey, text)}
              returnKeyType={onNext === undefined ? 'none' : 'next'}
            />
          )}
          {onUpdate === undefined && (
            <Text style={[styles.value, { lineHeight: 50 }]}>{value}</Text>
          )}
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  valueContainer: {
    padding: 0,
    height: 50,
    marginBottom: 4,
    backgroundColor: theme.colors.dark,
    borderRadius: theme.border.radius.sm,
  },
  value: {
    height: 50,
    minWidth: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 8,
    color: theme.colors.white,
    fontSize: theme.font.size.xl,
  },
  label: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: theme.colors.white,
    textTransform: 'uppercase',
    fontSize: theme.font.size.xsm,
  },
})
