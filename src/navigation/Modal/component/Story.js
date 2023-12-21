import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import * as Progress from 'react-native-progress';
import StoriesCloseIcon from '../../../assets/svg/icon/StoriesCloseIcon';
import FirstPage from '../../../component/referralStory/FirstPage';
import SecondPage from '../../../component/referralStory/SecondPage';
import ThirdPage from '../../../component/referralStory/ThirdPage';
import { useStore } from '../../../store/Context';

const Story = ({
  children = null,
  close,
  index = null,
  next = null,
  promo = false,
  closeButtonColor,
  referralPromo = false,
}) => {
  const [current, setCurrent] = useState(0);

  let content = [
    <FirstPage
      next={() => {
        setTime(0);
        setCurrent(1);
      }}
    />,
    <SecondPage
      next={() => {
        setTime(0);
        setCurrent(2);
      }}
      back={() => {
        setTime(0);
        setCurrent(0);
      }}
    />,
    <ThirdPage
      back={() => {
        setTime(0);
        setCurrent(1);
      }}
      close={close}
    />,
  ];

  const store = useStore();
  const [time, setTime] = useState(0);
  const { width } = useWindowDimensions();

  const press = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => {
        if (press.current) {
          return time;
        }
        if (index === store.story.currentStory) {
          return time + 100;
        }
        return time;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setTime(0);
    setCurrent(0);
  }, [store.story.currentStory]);

  useEffect(() => {
    if (time === 10000) {
      if (promo) {
        setTime(0);
        if (store.story.currentStory === 3) {
          close();
        } else {
          next();
        }
      } else {
        setTime(0);
        if (current === 2) {
          setCurrent(0);
          if (referralPromo) {
            next();
          } else {
            close();
          }
        } else {
          setTime(0);
          setCurrent((cur) => cur + 1);
        }
      }
    }
  }, [time]);

  const renderTime = useCallback(
    (i) => {
      if (current > i) {
        return 1;
      }
      if (current === i) {
        return time / 10000;
      }
      return 0;
    },
    [time]
  );

  return (
    <Wrapper
      onLongPress={() => (press.current = true)}
      onPressOut={() => (press.current = false)}
      delayLongPress={100}
    >
      <ProgressView>
        {promo ? (
          <Progress.Bar
            progress={time / 10000}
            width={null}
            height={2}
            borderWidth={0}
            unfilledColor="#E3E3E3"
            color="#000000"
          />
        ) : (
          <ProgressBarView>
            <Progress.Bar
              progress={renderTime(0)}
              width={width * 0.29}
              height={2}
              borderWidth={0}
              unfilledColor="#E3E3E3"
              color="#000000"
            />
            <Progress.Bar
              progress={renderTime(1)}
              width={width * 0.29}
              height={2}
              borderWidth={0}
              unfilledColor="#E3E3E3"
              color="#000000"
            />
            <Progress.Bar
              progress={renderTime(2)}
              width={width * 0.29}
              height={2}
              borderWidth={0}
              unfilledColor="#E3E3E3"
              color="#000000"
            />
          </ProgressBarView>
        )}

        <CloseButton onPress={() => close()}>
          <StoriesCloseIcon color={closeButtonColor} />
        </CloseButton>
      </ProgressView>

      {promo ? children : content[current]}
    </Wrapper>
  );
};

export default observer(Story);

const Wrapper = styled(Pressable)`
  flex: 1;
`;
const ProgressView = styled.View`
  width: 90%;
  align-self: center;
  margin-top: 20px;
  position: absolute;
  z-index: 1;
`;
const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  margin-top: 16px;
  padding: 5px;
`;
const ProgressBarView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
