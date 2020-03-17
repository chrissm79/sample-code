import React from 'react'
import { StyleSheet, View } from 'react-native'
import { graphql, useFragment, useRelayEnvironment } from 'react-relay/hooks'
import { ProgramStation_station$key } from '@influence/graphql/ProgramStation_station.graphql'
import { theme } from '@influence/theme'
import { Button } from '../buttons'
import { ProgramSet } from './ProgramSet'
import { ProgramExercise } from './ProgramExercise'
import { addProgramSetAction } from '@influence/core'
import { useProgramTransition } from './ProgramProvider'
import { InputReferenceMap, InputReference } from './program.types'

const fragment = graphql`
  fragment ProgramStation_station on Station {
    id
    open
    editable
    ...ProgramExercise_station
    sets {
      ...ProgramSet_set
    }
  }
`

type Props = {
  station: ProgramStation_station$key
  onNext: () => void
  onViewHistory?: () => void
}

export const ProgramStation = React.forwardRef<InputReference, Props>(
  ({ station, onNext, onViewHistory = undefined }, ref) => {
    const environment = useRelayEnvironment()
    const { animateNext } = useProgramTransition()
    const data = useFragment(fragment, station)
    const inputs = React.useRef<InputReferenceMap>(new Map())
    const height = data.open ? 'auto' : 0

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        const input = inputs.current.get('0')
        if (input && !!input.focus) {
          input.focus()
        }
      },
    }))

    const handleOnPress = React.useCallback(() => {
      animateNext()
      addProgramSetAction({ environment, stationID: data.id })
    }, [data.id])

    const handleOnNext = React.useCallback(
      (nextIndex: number) => {
        const input = inputs.current.get(`${nextIndex}`)

        if (input && !!input.focus) {
          input.focus()
        } else {
          onNext()
        }
      },
      [inputs]
    )

    return (
      <ProgramExercise station={data}>
        <View style={[styles.list, { height }]}>
          <View style={[styles.bottomContainer]}>
            <View style={[styles.container]}>
              {data.sets.map((set, i) => {
                const nextIndex = i + 1
                return (
                  <View style={[styles.setContainer]} key={set.__id}>
                    <ProgramSet
                      set={set}
                      index={nextIndex}
                      stationID={data.id}
                      onNext={() => handleOnNext(nextIndex)}
                      ref={input => inputs.current.set(`${i}`, input)}
                    />
                  </View>
                )
              })}
            </View>
            {data.editable && (
              <Button type="dashed-white" onPress={handleOnPress}>
                Add Set
              </Button>
            )}
            {!data.editable && onViewHistory !== undefined && (
              <Button type="primary" onPress={onViewHistory}>
                Exercise History
              </Button>
            )}
          </View>
        </View>
      </ProgramExercise>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  setContainer: {
    paddingBottom: 16,
  },
  bottomContainer: {
    padding: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderRadius: theme.border.radius.base,
  },
  list: {
    overflow: 'hidden',
  },
})
