import React from 'react'
import { Image, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { theme } from '@influence/theme'

type Props = {
  editable: boolean
  onDelete: () => void
}

export const ProgramSwipeable: React.FC<Props> = ({
  children,
  editable,
  onDelete,
}) => {
  return (
    <Swipeable
      renderRightActions={(progress, dragX) => {
        if (!editable) {
          return null
        }

        const trans = dragX.interpolate({
          inputRange: [-45, 0],
          outputRange: [0, 45],
          extrapolate: 'clamp',
        })

        const opacity = dragX.interpolate({
          inputRange: [-45, 0],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        })

        return (
          <Animated.View
            style={[
              styles.deleteContainer,
              {
                opacity,
                transform: [{ translateX: trans }],
              },
            ]}
          >
            <TouchableOpacity onPress={onDelete}>
              <Image
                source={require('../../../assets/icons/icon-trash-can.png')}
              />
            </TouchableOpacity>
          </Animated.View>
        )
      }}
    >
      {children}
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  deleteContainer: {
    width: 50,
    height: 50,
    padding: 0,
    marginLeft: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.red,
    borderRadius: theme.border.radius.sm,
  },
})
