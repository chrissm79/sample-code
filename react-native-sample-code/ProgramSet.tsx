import React from 'react'
import {
  Image,
  ViewStyle,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import { graphql, useFragment, useRelayEnvironment } from 'react-relay/hooks'
import { ProgramSet_set$key } from '@influence/graphql/ProgramSet_set.graphql'
import {
  deleteProgramSetAction,
  updateProgramSetAction,
  toggleProgramSetStatusAction,
} from '@influence/core'
import { theme } from '@influence/theme'
import { HStack } from '../layout'
import { HSpacer } from '../spacer'
import { ProgramSetInput } from './ProgramSetInput'
import { useProgramTransition } from './ProgramProvider'
import { ProgramSwipeable } from './ProgramSwipeable'
import { InputReference, InputReferenceMap } from './program.types'

const fragment = graphql`
  fragment ProgramSet_set on ExerciseSet {
    id
    status
    editable
    ... on WeightSet {
      weight
      reps
    }
  }
`

type Props = {
  index: number
  stationID: string
  style?: ViewStyle
  set: ProgramSet_set$key
  onNext?: () => void
}

export const ProgramSet = React.forwardRef<InputReference, Props>(
  ({ set, index, stationID, style = {}, onNext = undefined }, ref) => {
    const data = useFragment(fragment, set)
    const environment = useRelayEnvironment()
    const { animateNext, nativeID } = useProgramTransition()
    const inputs = React.useRef<InputReferenceMap>(new Map())

    const handleOnDelete = React.useCallback(() => {
      animateNext()
      deleteProgramSetAction({ environment, stationID, setID: data.id })
    }, [data.id, stationID])

    const handleOnUpdate = (key: 'reps' | 'weight', value: string) => {
      updateProgramSetAction({ environment, setID: data.id, key, value })
    }
    const handleOnNext = (key: string) => inputs.current.get(key).focus()
    const handleOnToggle = () =>
      toggleProgramSetStatusAction({ environment, setID: data.id })

    const handleOnComplete = () => {
      if (data.status !== 'COMPLETE') {
        handleOnToggle()
      }

      if (onNext !== undefined) {
        onNext()
      }
    }

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputs.current) {
          inputs.current.get('lbs').focus()
        }
      },
    }))

    return (
      <ProgramSwipeable
        editable={data.editable ?? false}
        onDelete={handleOnDelete}
      >
        <HStack style={{ ...styles.container, ...style }}>
          <ProgramSetInput
            label="set"
            valueKey="set"
            value={`${index}`}
            status={data.status}
          />
          <HSpacer width={8} />
          <ProgramSetInput
            label="lbs"
            valueKey="weight"
            nativeID={nativeID}
            status={data.status}
            value={`${data.weight}`}
            ref={input => inputs.current.set('lbs', input)}
            onUpdate={data.editable ? handleOnUpdate : undefined}
            onNext={data.editable ? () => handleOnNext('reps') : undefined}
          />
          <HSpacer width={8} />
          <ProgramSetInput
            label="reps"
            valueKey="reps"
            status={data.status}
            nativeID={nativeID}
            value={`${data.reps}`}
            ref={input => inputs.current.set('reps', input)}
            onNext={data.editable ? handleOnComplete : undefined}
            onUpdate={data.editable ? handleOnUpdate : undefined}
          />
          <HSpacer width={8} />
          {data.editable && (
            <View>
              <TouchableOpacity onPress={handleOnToggle}>
                <View
                  style={[
                    styles.valueContainer,
                    {
                      borderColor:
                        data.status === 'COMPLETE'
                          ? theme.colors.green
                          : theme.colors.dark,
                    },
                  ]}
                >
                  <Image
                    source={require('../../../assets/icons/icon-checkmark.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </HStack>
      </ProgramSwipeable>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  valueContainer: {
    height: 50,
    borderWidth: 2,
    paddingVertical: 4,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.dark,
    borderRadius: theme.border.radius.sm,
    borderColor: 'rgba(151,151,151,0.2)',
  },
})
