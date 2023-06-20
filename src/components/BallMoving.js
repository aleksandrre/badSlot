import React, { useMemo, useState } from "react";

function BallAnimation() {
  const [ballPosition, setBallPosition] = useState({
    x: 0,
    y: 460,
    dx: Math.random() * 5,
    dy: -Math.random() * 5,
    touchOnWall: 0,
    xBet: 1,
    notTouchLosingArea: true,
    bet: 2,
    balance: 1000,
    xBetArray: [],
    kiti: true,
  });
  //სპინის გაკეთება ღილაკზე დაწკაპებით
  const handleSpinClick = () => {
    if (ballPosition.kiti) {
      spinFunction();
    }
    requestAnimationFrame(move);
  };
  //ბურთის მოძრაობის ლოგიკა
  const move = () => {
    setBallPosition((prevPosition) => {
      let {
        x,
        y,
        dx,
        dy,
        touchOnWall,
        xBet,
        notTouchLosingArea,
        bet,
        balance,
        xBetArray,
        kiti,
      } = prevPosition;

      if (y > 460 || y < 0) {
        touchOnWall += 1;
        dy *= -1;
        // console.log("shemovida?");
        if (x >= 280 && x <= 480) {
          xBet *= 2;
          xBetArray = [...xBetArray, 2];
        } else if ((x > 180 && x < 280) || (x > 480 && x < 880)) {
          xBet *= 1;
        } else {
          xBet *= 0;
          notTouchLosingArea = false;
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

      if (touchOnWall < 5 && notTouchLosingArea) {
        kiti = false;
        requestAnimationFrame(move);
      } else {
        kiti = true;
        balance += xBet * bet;
      }
      return {
        x,
        y,
        dx,
        dy,
        touchOnWall,
        xBet,
        notTouchLosingArea,
        bet,
        balance,
        xBetArray,
        kiti,
      };
    });
  };

  //ახალი სპინის გაკეთება (საწყის კოორდინატებზე დაბრუნება)
  const spinFunction = () => {
    console.log("helllow");
    setBallPosition((prevPosition) => {
      return {
        ...prevPosition,
        x: 0,
        y: 460,
        dx: Math.random() * 5,
        dy: -Math.random() * 5,
        touchOnWall: 0,
        xBet: 1,
        notTouchLosingArea: true,
        balance: prevPosition.balance - prevPosition.bet,
        xBetArray: [],
        kiti: true,
      };
    });
  };

  // ბეთის აწევა დაწევის ღილაკები
  const betDivs = () => {
    const divs = [];

    for (let i = 1; i < 5; i++) {
      divs.push(
        <div
          key={i}
          className="spinButton"
          id={i * 2}
          style={i * 2 === ballPosition.bet ? { backgroundColor: "blue" } : {}}
          onClick={(e) => {
            if (
              // ballPosition.touchOnWall >= 5 ||
              // !ballPosition.notTouchLosingArea
              ballPosition.kiti
            )
              setBallPosition((prev) => {
                return { ...prev, bet: parseInt(e.target.id) };
              });
          }}
        >
          {i * 2} gel
        </div>
      );
    }

    return divs;
  };

  // მოგება-წაგების ინტერვალები
  const winLoseDivs = () => {
    const divs = [];

    for (let i = 1; i < 10; i++) {
      divs.push(<div key={i} className={`div${i}`}></div>);
    }

    return divs;
  };

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
  }, [ballPosition.xBet]);

  //მოგება წაგების ტექსტი ყოველი სპინის შემდეგ
  const winOrLoseText = useMemo(() => {
    return (
      <div>
        {ballPosition.touchOnWall >= 5 && ballPosition.notTouchLosingArea
          ? `You win ${ballPosition.xBet * ballPosition.bet}`
          : !ballPosition.notTouchLosingArea
          ? "you lose"
          : ""}
      </div>
    );
  }, [ballPosition.touchOnWall]);

  return (
    <div className="body">
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
        {winLoseDivs()}
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
        <div className="balanceDiv">
          {/* <h1>balance</h1> */}
          {ballPosition.balance} Gel
        </div>
        <div className="spinButton" onClick={handleSpinClick}>
          spin
        </div>
        {betDivs()}
      </div>
    </div>
  );
}

export default BallAnimation;
