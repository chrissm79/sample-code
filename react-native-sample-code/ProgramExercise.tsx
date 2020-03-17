import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { graphql, useFragment, useRelayEnvironment } from 'react-relay/hooks'
import Animated, { Easing } from 'react-native-reanimated'
import { bInterpolate, bInterpolateColor, useToggle } from 'react-native-redash'
import { toggleProgramStationOpenAction } from '@influence/core'
import { theme } from '@influence/theme'
import { useProgramTransition } from './ProgramProvider'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { HStack } from '../layout'
import { ProgramExercise_station$key } from '@influence/graphql/ProgramExercise_station.graphql'

const fragment = graphql`
  fragment ProgramExercise_station on Station {
    id
    open
    exercise {
      id
      name
    }
    sets {
      id
    }
  }
`

type Props = {
  station: ProgramExercise_station$key
}

export const ProgramExercise: React.FC<Props> = ({ station, children }) => {
  const environment = useRelayEnvironment()
  const data = useFragment(fragment, station)
  const { duration, animateNext } = useProgramTransition()
  const { open } = data

  const transition = useToggle(open, duration, Easing.inOut(Easing.ease))

  const rotateZ = bInterpolate(transition, 0, Math.PI / 2)
  const backgroundColor = bInterpolateColor(
    transition,
    { r: 245, g: 245, b: 245 },
    { r: 35, g: 38, b: 79 }
  )
  const iconBgColor = bInterpolateColor(
    transition,
    { r: 26, g: 28, b: 58 },
    { r: 67, g: 213, b: 228 }
  )
  const color = bInterpolateColor(
    transition,
    { r: 64, g: 63, b: 72 },
    { r: 255, g: 255, b: 255 }
  )

  const handleToggle = React.useCallback(() => {
    animateNext()
    toggleProgramStationOpenAction({ environment, stationID: data.id })
  }, [data.id])

  return (
    <Animated.View style={[styles.container, { backgroundColor } as any]}>
      <View style={{ padding: 16 }}>
        <TouchableWithoutFeedback onPress={handleToggle}>
          <View>
            <HStack vCenter={true} style={{ paddingRight: 4 }}>
              <Animated.View
                style={[styles.icon, { backgroundColor: iconBgColor } as any]}
              >
                <Image
                  style={[{ tintColor: '#FFF' }]}
                  source={require('../../../assets/icons/icon-chest.png')}
                />
              </Animated.View>
              <View style={[styles.content]}>
                <Animated.Text style={[styles.exercise, { color } as any]}>
                  {data.exercise.name}
                </Animated.Text>
                <Animated.Text style={[styles.bodyPart, { color } as any]}>
                  {data.sets.length} x Sets
                </Animated.Text>
              </View>
              <Animated.View style={[{ transform: [{ rotateZ }] } as any]}>
                <Image
                  source={require('../../../assets/icons/icon-chevron.png')}
                />
              </Animated.View>
            </HStack>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: theme.border.radius.base,
  },
  innerContainer: {
    overflow: 'hidden',
  },
  bottomContainer: {
    padding: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderRadius: theme.border.radius.base,
  },
  icon: {
    width: 42,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.border.radius.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  exercise: {
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: theme.font.size.lg,
  },
  bodyPart: {
    fontWeight: '500',
    fontSize: theme.font.size.body,
  },
  list: {
    overflow: 'hidden',
  },
})
