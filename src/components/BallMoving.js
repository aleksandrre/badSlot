import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function BallAnimation() {
  let V = 14;
  let dx = Math.random() * 14;
  let randomNumber = Math.random();
  const reference = useRef();

  const [ballPosition, setBallPosition] = useState({
    x: 0,
    y: 460,
    dx: dx,
    dy: -Math.sqrt(V * V - dx * dx),
    touchOnWall: 0,
    xBet: 1,
    touchLosingArea: false,
    bet: 2,
    balance: 1000,
    xBetArray: [],
    spininigProcess: false,
    doubleORlose: false,
    redORblackWinowLose: false,
    spinCanLoading: true,
  });

  //სპინის გაკეთება ღილაკზე დაწკაპებით
  console.log(ballPosition);
  const handleSpinClick = () => {
    console.log("2");

    if (ballPosition.spinCanLoading || ballPosition.touchLosingArea) {
      if (!ballPosition.spininigProcess) {
        ballPosition.balance = ballPosition.balance - ballPosition.bet;
        // setBallPosition((prev) => {
        //   return {
        //     ...prev,
        //     balance: ballPosition.balance + ballPosition.xBet * ballPosition.bet,
        //   };
        // });

        beforeSpinFunction();
        console.log("3"); //სპინის დასრულების შემდეგ ახლდება state (ბურთის პარამეტრები და ინფორმაცია თამაშზე)
      }
      console.log("4");
      ballPosition.spinCanLoading = false;
      requestAnimationFrame(move);
    }
  };
  //ბურთის მოძრაობის ლოგიკა
  const move = () => {
    console.log("6");
    setBallPosition((prevPosition) => {
      let {
        x,
        y,
        dx,
        dy,
        touchOnWall,
        xBet,
        touchLosingArea,
        bet,
        balance,
        xBetArray,
        spininigProcess,
      } = prevPosition;

      if (y > 460 || y < 0) {
        touchOnWall += 1;
        dy *= -1;

        if (x >= 280 && x <= 480) {
          xBet *= 2;
          xBetArray = [...xBetArray, 2];
        } else if ((x > 180 && x < 280) || (x > 480 && x < 880)) {
          xBet *= 1;
        } else {
          xBet *= 0;
          xBetArray = [...xBetArray, 0];
          touchLosingArea = true;
        }
      }
      if (x > 1000 - 40 || x < 0) {
        touchOnWall += 1;
        dx *= -1;

        if (y >= 130 && y <= 330) {
          xBet *= 3;
          xBetArray = [...xBetArray, 3];
        } else if (y > 330) {
          xBet *= 1;
        }
      }

      x += dx;
      y += dy;
      //კედელთან შეხებების რაოდენობის და losing area-ში მოხვედრის შემოწმება
      if (touchOnWall < 5 && !touchLosingArea) {
        spininigProcess = true;

        requestAnimationFrame(move);
      } else if (touchLosingArea) {
        spininigProcess = false;
      }

      return {
        x,
        y,
        dx,
        dy,
        touchOnWall,
        xBet,
        touchLosingArea,
        bet,
        balance,
        xBetArray,
        spininigProcess,
      };
    });
  };

  //ახალი სპინის გაკეთების ფუნქცია (საწყის კოორდინატებზე დაბრუნება)
  const beforeSpinFunction = () => {
    console.log("beforeSpinFunction");
    setBallPosition((prevPosition) => {
      return {
        ...prevPosition,
        x: 0,
        y: 460,
        dx: dx,
        dy: -Math.sqrt(V * V - dx * dx),
        touchOnWall: 0,
        xBet: 1,
        touchLosingArea: false,
        xBetArray: [],
        spininigProcess: false,
        doubleORlose: false,
      };
    });
  };

  // ბეთის აწევა დაწევის ღილაკები
  const betDivs = useMemo(() => {
    const divs = [];

    for (let i = 1; i < 5; i++) {
      divs.push(
        <div
          key={i}
          className="spinButton"
          id={i * 2}
          style={
            i * 2 === ballPosition.bet
              ? { backgroundColor: "orange", color: "white" }
              : {}
          }
          onClick={(e) => {
            console.log(ballPosition.touchLosingArea);
            if (!ballPosition.spininigProcess)
              setBallPosition((prev) => {
                return {
                  ...prev,
                  bet: parseInt(e.target.id),
                  xBetArray: [],
                  // touchLosingArea: false,
                  spinCanLoading: true,
                };
              });
          }}
        >
          {i * 2} gel
        </div>
      );
    }

    return divs;
  }, [ballPosition.bet, ballPosition.spininigProcess]);

  // მოგება-წაგების ინტერვალები
  const winLoseDivs = useMemo(() => {
    const divs = [];

    for (let i = 1; i < 9; i++) {
      divs.push(<div key={i} className={`div${i}`}></div>);
    }

    return divs;
  }, []);

  // კოეფიციენტების გადამრავლება ლაივში
  const winingProcessText = useMemo(() => {
    return (
      <div className="">
        {ballPosition.bet +
          "X1X" +
          ballPosition.xBetArray.join("X") +
          `=${ballPosition.xBet * ballPosition.bet}`}
      </div>
    );
  }, [ballPosition.xBet, ballPosition.bet]);

  //მოგება წაგების ტექსტი ყოველი სპინის შემდეგ
  const winOrLoseText = useMemo(() => {
    return (
      <div>
        {ballPosition.touchOnWall >= 5 && !ballPosition.touchLosingArea
          ? `You win ${ballPosition.xBet * ballPosition.bet}`
          : ballPosition.touchLosingArea
          ? "you lose"
          : ""}
      </div>
    );
  }, [ballPosition.touchOnWall, ballPosition.xBet, ballPosition.bet]);

  //ფულის გადაყრა სუფულეში

  const takeWin = () => {
    console.log("logggg");
    setBallPosition((prev) => {
      return {
        ...prev,
        balance: ballPosition.balance + ballPosition.xBet * ballPosition.bet,
        spinCanLoading: true,
      };
    });
    beforeSpinFunction();
  };
  //რისკი გაორმაგების მცდელობა
  const doubleWinTry = () => {
    setBallPosition((prev) => {
      return {
        ...prev,
        doubleORlose: true,
      };
    });
  };

  //გაორმაგების მცდელობის უარყოფითად დასრულების პროცესის აღწერა
  const appearDisappearText = () => {
    console.log("looogii");
    reference.current.style.opacity = 1;
    setTimeout(() => {
      reference.current.style.opacity = 0;
      beforeSpinFunction();
    }, 1000);
    setBallPosition((prev) => {
      return {
        ...prev,
        xBet: ballPosition.xBet * 0,
        xBetArray: [...ballPosition.xBetArray, 0],
        redORblackWinowLose: false,
        spinCanLoading: true,
      };
    });
  };
  //გაორმაგების მცდელობის დადებითად დასრულების პროცესის აღწერა
  const appearDisappearText2 = () => {
    reference.current.style.opacity = 1;
    setTimeout(() => {
      reference.current.style.opacity = 0;
    }, 1000);
    setBallPosition((prev) => {
      return {
        ...prev,
        xBet: ballPosition.xBet * 2,
        xBetArray: [...ballPosition.xBetArray, 2],
        redORblackWinowLose: true,
      };
    });
  };

  //პირობა იმის თუ რაშემთხვევაში გაორმაგდეს.
  const blackORred1 = () => {
    if (randomNumber < 0.5) {
      appearDisappearText2();
    } else {
      appearDisappearText();
    }
  };
  const blackORred2 = () => {
    if (randomNumber > 0.5) {
      appearDisappearText2();
    } else {
      appearDisappearText();
    }
  };

  return (
    <div className="body">
      <div
        className="doubleOrLoseparentparent"
        style={{ display: ballPosition.doubleORlose ? "flex" : "none" }}
      >
        <div className="doubleOrLoseparent">
          <div className="doubleOrLose1" onClick={blackORred1}>
            X2
          </div>
          <div className="doubleOrLose2" onClick={blackORred2}>
            X2
          </div>
        </div>
        <h1 style={{ opacity: 0 }} ref={reference}>
          {ballPosition.redORblackWinowLose ? "You win " : "You lost"}
        </h1>
      </div>

      <div className="instructionDiv">
        <div className="instructionDivDivs">
          x2
          <div className="instructionDiv1"></div>
        </div>
        <div className="instructionDivDivs">
          x3
          <div className="instructionDiv2"></div>
        </div>
        <div className="instructionDivDivs">
          lose
          <div className="instructionDiv3"></div>
        </div>
      </div>
      <div className="winAmount">
        {winingProcessText}
        {winOrLoseText}
      </div>

      <div className="main">
        {winLoseDivs}
        <div
          className="ball"
          style={{
            backgroundColor: "red",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            position: "relative",
            left: `${ballPosition.x}px`,
            top: `${ballPosition.y}px`,
          }}
        ></div>
      </div>
      <div className="actionButtons">
        <div className="balanceDiv">{ballPosition.balance} Gel</div>
        <div className="spinButton" onClick={handleSpinClick}>
          spin
        </div>
        {betDivs}
        <div className="fifty-fiftyDiv">
          <div
            className="X2orTake"
            style={{
              display:
                ballPosition.touchLosingArea || ballPosition.touchOnWall < 5
                  ? "none"
                  : "flex",
            }}
            onClick={() => takeWin()}
          >
            Take
          </div>
          <div
            className="X2orTake"
            style={{
              display:
                ballPosition.touchLosingArea || ballPosition.touchOnWall < 5
                  ? "none"
                  : "flex",
            }}
            onClick={doubleWinTry}
          >
            X2
          </div>
        </div>
      </div>
    </div>
  );
}

export default BallAnimation;
