import {useEffect, useState} from "react"
import GameResult from "./game-result"
import classNames from "classnames"
import {useRouter} from "next/navigation"
import {Hero} from "@/models/hero"
import Button from "@/components/ui/button"
import {sleep} from "@/utils/number"

// import background from "@/assets/images/gameplay"

export default function Gameplay({
                                   result,
                                   squad,
                                   opSquad,
                                   hasLottery,
                                 }: {
  result: boolean
  squad: Hero[]
  opSquad: Hero[]
  hasLottery: boolean
}) {
  const router = useRouter()
  const [isEnded, setIsEnded] = useState(false)
  const [showSkipButton, setShowSkipButton] = useState(false)

  const backToPreviousPage = () => {
    router.replace("/tournament")
  }

  const getFirstStopGradient = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "#64748b"
      case "uncommon":
        return "#84cc16"
      case "rare":
        return "#6366f1"
      case "epic":
        return "#7e22ce"
      case "legendary":
        return "#f59e0b"
    }
  }

  const getSecondStopGradient = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "#cbd5e1"
      case "uncommon":
        return "#bef264"
      case "rare":
        return "#a5b4fc"
      case "epic":
        return "#a855f7"
      case "legendary":
        return "#fcd34d"
    }
  }

  useEffect(() => {
    if (result == undefined) {
      return
    }

    const canvas = document.getElementById("game")
    const ctx = canvas.getContext("2d")

    const gameWidth = window.innerWidth - 400
    //1520
    const gameHeight = window.innerHeight - 136
    //834

    canvas.width = gameWidth
    canvas.height = gameHeight

    let battleResult = result ? "win" : "lose"

    let randomExist = 1
    let round = 0

    class Projectile {
      constructor(game, x, y, speedX, speedY, img, context) {
        this.game = game
        this.x = x
        this.y = y
        // this.image = document.getElementById(img)
        this.image = new Image()
        this.image.src = `/assets/gameplay/${img}.png`
        this.width = 70
        this.height = 20
        this.speedX = speedX
        this.speedY = speedY
        this.maxFrame = 3
        this.markedForDeletion = false
        this.context = context

        this.draw()
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
      }

      draw() {
        this.context.drawImage(
          this.image,
          this.x,
          this.y,
          this.width,
          this.height,
        )
      }
    }

    class Damage {
      constructor(x, y, damage) {
        this.damage = 0
        this.x = x
        this.y = y
        this.height = y - 30
        this.speed = -1
        this.markedForDeletion = false
        this.damage = damage
      }

      update() {
        this.y += this.speed
        if (this.y < this.height) {
          this.markedForDeletion = true
        }
      }

      draw(context) {
        context.textAlign = "center"
        context.font = "bold 70px"
        context.fillStyle = "red"
        context.fillText(`${this.damage}`, this.x, this.y)
      }
    }

    class Hero {
      constructor(game, x, y, hpColor, img, hp, info, context) {
        this.game = game
        this.x = x
        this.y = y
        this.radius = 80
        this.maxHp = hp
        this.hp = hp
        this.hpColor = hpColor
        // this.image = document.getElementById(img)
        this.image = new Image()
        // this.image.src = "/assets/gameplay/avt.png"
        this.image.src = img
        this.speed = 0
        this.allyShoot = []
        this.enemyShoot = []

        this.damage = []
        this.hpRatio = 0
        this.ratioDamage = 0
        this.alive = 0

        this.fire = false
        this.projectileX = 0
        this.prokectileY = 0

        this.markedForDeletion = false
        // this.imageDie = document.getElementById("die")
        this.imageDie = new Image()
        this.imageDie.src = "/assets/gameplay/die.png"

        this.info = info
        this.context = context
      }

      update() {
        this.radius += this.speed
        if (this.radius < 60.5) {
          this.radius = 60.5
          this.speed = 2
        } else if (this.radius == 80) {
          this.speed = 0
          this.radius = 80
        } else if (this.radius > 90) {
          this.radius = 90
          this.speed = -1
        }

        if (this.fire && this.speed == 0) {
          const randomProjectile = Math.floor(Math.random() * 4) + 1
          if (this.projectileX > 0) {
            this.allyShoot.push(
              new Projectile(
                this.game,
                this.x + this.radius,
                this.y,
                this.projectileX,
                this.prokectileY,
                `projectile0${randomProjectile}`,
                this.context,
              ),
            )
          } else {
            this.enemyShoot.push(
              new Projectile(
                this.game,
                this.x - this.radius,
                this.y,
                this.projectileX,
                this.prokectileY,
                `projectile1${randomProjectile}`,
                this.context,
              ),
            )
          }
          this.fire = false
        }

        this.allyShoot.forEach((shoot) => {
          shoot.update()
          this.game.enemy.forEach((hero) => {
            if (
              this.game.checkCollisionEnemy(shoot, hero) &&
              !hero.markedForDeletion
            ) {
              shoot.markedForDeletion = true
              hero.speed = 1

              let bonus = Math.random() * 0.04

              let msg =
                hero.ratioDamage == 0
                  ? "MISS"
                  : `- ${Math.round(hero.maxHp * (hero.ratioDamage + bonus))}`
              if (msg != "MISS") {
                hero.hpRatio += (hero.ratioDamage + bonus) * 2
                if (hero.hpRatio >= 2) {
                  hero.markedForDeletion = true
                }
                hero.hp -= hero.maxHp * (hero.ratioDamage + bonus)
              }

              if (hero.hp < 0) {
                hero.hp = 0
              }

              if (msg == "MISS") {
                this.damage.push(new Damage(hero.x, hero.y - hero.radius, msg))
              }
              // this.damage.push(new Damage(hero.x, hero.y - hero.radius, msg));
            }
          })
        })

        this.enemyShoot.forEach((shoot) => {
          shoot.update()
          this.game.ally.forEach((hero) => {
            if (
              this.game.checkCollisionAlly(shoot, hero) &&
              !hero.markedForDeletion
            ) {
              shoot.markedForDeletion = true
              hero.speed = 1

              let bonus = Math.random() * 0.04
              let msg =
                hero.ratioDamage == 0
                  ? "MISS"
                  : `- ${Math.round(hero.maxHp * (hero.ratioDamage + bonus))}`
              if (msg != "MISS") {
                hero.hpRatio += (hero.ratioDamage + bonus) * 2
                if (hero.hpRatio >= 2) {
                  hero.markedForDeletion = true
                }
                hero.hp -= hero.maxHp * (hero.ratioDamage + bonus)
              }
              if (hero.hp < 0) {
                hero.hp = 0
              }

              if (msg == "MISS") {
                this.damage.push(new Damage(hero.x, hero.y - hero.radius, msg))
              }
              // this.damage.push(new Damage(hero.x, hero.y - hero.radius, msg));
            }
          })
        })

        this.damage.forEach((damage) => {
          damage.update()
        })

        this.allyShoot = this.allyShoot.filter(
          (projectile) => !projectile.markedForDeletion,
        )
        this.enemyShoot = this.enemyShoot.filter(
          (projectile) => !projectile.markedForDeletion,
        )
        this.damage = this.damage.filter((damage) => !damage.markedForDeletion)
      }

      draw() {
        this.context.shadowColor = "white"
        this.context.shadowBlur = 15

        const gradient = this.context.createLinearGradient(
          this.x - this.radius + 15,
          this.y - this.radius + 15,
          this.x - this.radius + 15,
          this.y - this.radius + 15 + (this.radius - 15) * 2,
        )

        gradient.addColorStop(0, getFirstStopGradient(this.info.rarity))
        gradient.addColorStop(1, getSecondStopGradient(this.info.rarity))
        if (this.markedForDeletion) {
          this.context.fillStyle = "#4b5563"
        } else {
          this.context.fillStyle = gradient
        }
        // ctx.fillRect(this.x, this.y, 0, 200, 100)

        this.context.beginPath()
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        this.context.fill()

        this.context.shadowBlur = 0
        if (this.markedForDeletion) {
          this.context.globalAlpha = 0.4
        }
        this.context.drawImage(
          this.image,
          this.x - this.radius + 15,
          this.y - this.radius + 15,
          (this.radius - 15) * 2,
          (this.radius - 15) * 2,
        )
        if (this.markedForDeletion) {
          this.context.globalAlpha = 1
        }

        this.context.strokeStyle = "black"
        this.context.lineWidth = 2
        this.context.beginPath()
        this.context.arc(
          this.x,
          this.y,
          this.radius - 0,
          -Math.PI * 0.5,
          Math.PI * 1.5,
          true,
        )
        this.context.stroke()

        this.context.strokeStyle = "black"
        this.context.lineWidth = 2
        this.context.beginPath()
        this.context.arc(
          this.x,
          this.y,
          this.radius - 8,
          -Math.PI * 0.5,
          Math.PI * 1.5,
          true,
        )
        this.context.stroke()

        this.context.strokeStyle = "white"
        this.context.lineWidth = 6
        // Draw the inner circle line
        this.context.beginPath()
        this.context.arc(
          this.x,
          this.y,
          this.radius - 4,
          -Math.PI * 0.5,
          Math.PI * 1.5,
          true,
        )
        this.context.stroke()

        this.context.strokeStyle = this.hpColor
        this.context.lineWidth = 6

        this.context.beginPath()
        if (this.hpRatio >= 2) {
          this.hpRatio = 2
        }
        this.context.arc(
          this.x,
          this.y,
          this.radius - 4,
          -Math.PI * 0.5,
          Math.PI * (1.5 + this.hpRatio),
          true,
        )
        this.context.stroke()
        // Draw the inner circle line
        // this.context.stroke()

        if (this.markedForDeletion) {
          this.context.drawImage(
            this.imageDie,
            this.x - this.radius + 15,
            this.y - this.radius + 15,
            (this.radius - 15) * 2,
            (this.radius - 15) * 2,
          )
        }

        this.damage.forEach((damage) => {
          damage.draw(this.context)
        })
        this.enemyShoot.forEach((projectile) => {
          projectile.draw()
        })
        this.allyShoot.forEach((projectile) => {
          projectile.draw()
        })
      }
    }

    class Background {
      constructor(game) {
        this.game = game
        this.image = new Image()
        this.image.src = "/assets/gameplay/background.jpg"
        this.x = 0
        this.y = 0
        this.width = this.game.width
        this.height = this.game.height
      }

      draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
      }
    }

    class Game {
      constructor(width, height, context) {
        this.width = width
        this.height = height
        this.ally = []
        this.enemy = []
        this.context = context

        if (squad.length >= 1) {
          this.ally1 = new Hero(
            this,
            200,
            (this.height - 600) / 2 + 100,
            "green",
            squad[0].img,
            100,
            squad[0],
            this.context,
          )
          this.ally.push(this.ally1)
        }
        if (squad.length >= 2) {
          this.ally2 = new Hero(
            this,
            320,
            (this.height - 600) / 2 + 300,
            "green",
            squad[1].img,
            200,
            squad[1],
            this.context,
          )
          this.ally.push(this.ally2)
        }
        if (squad.length >= 3) {
          this.ally3 = new Hero(
            this,
            200,
            (this.height - 600) / 2 + 500,
            "green",
            squad[2].img,
            300,
            squad[2],
            this.context,
          )
          this.ally.push(this.ally3)
        }

        if (opSquad.length >= 1) {
          this.enemy1 = new Hero(
            this,
            this.width - 200,
            (this.height - 600) / 2 + 100,
            "red",
            opSquad[0].img,
            150,
            opSquad[0],
            this.context,
          )
          this.enemy.push(this.enemy1)
        }
        if (opSquad.length >= 2) {
          this.enemy2 = new Hero(
            this,
            this.width - 320,
            (this.height - 600) / 2 + 300,
            "red",
            opSquad[1].img,
            150,
            opSquad[1],
            this.context,
          )
          this.enemy.push(this.enemy2)
        }
        if (opSquad.length >= 3) {
          this.enemy3 = new Hero(
            this,
            this.width - 200,
            (this.height - 600) / 2 + 500,
            "red",
            opSquad[2].img,
            250,
            opSquad[2],
            this.context,
          )
          this.enemy.push(this.enemy3)
        }

        this.background = new Background(this)
      }

      update() {
        this.ally.forEach((hero) => {
          hero.update()
        })
        this.enemy.forEach((hero) => {
          hero.update()
        })
      }

      draw() {
        this.background.draw(this.context)
        this.ally.forEach((hero) => {
          hero.draw(this.context)
        })
        this.enemy.forEach((hero) => {
          hero.draw(this.context)
        })
      }

      checkCollisionEnemy(projectile, hero) {
        return (
          projectile.x > hero.x - hero.radius &&
          projectile.x + projectile.width > hero.x - hero.radius &&
          projectile.y < hero.y + hero.radius &&
          projectile.y + projectile.height > hero.y - hero.radius
        )
      }

      checkCollisionAlly(projectile, hero) {
        return (
          projectile.x < hero.x + hero.radius &&
          projectile.x + projectile.width > hero.x + hero.radius &&
          projectile.y < hero.y + hero.radius &&
          projectile.y + projectile.height > hero.y - hero.radius
        )
      }
    }

    const game = new Game(canvas.width, canvas.height, ctx)

    ;(function animate() {
      game.update()
      game.draw()
      requestAnimationFrame(animate)
    })()

    function randomAttack(attacker, defender) {
      attacker = attacker.filter((hero) => !hero.markedForDeletion)
      defender = defender.filter((hero) => !hero.markedForDeletion)
      const randomDefender =
        defender[Math.floor(Math.random() * (defender.length - 1))]

      let numberAttacker = 1
      if (
        battleResult == "WIN-PROCESSING" ||
        battleResult == "LOSE-PROCESSING"
      ) {
        if (randomDefender.alive > 2 && attacker.length >= 2) {
          numberAttacker = Math.floor(Math.random() * attacker.length) + 2
          if (
            randomDefender.alive == 3 &&
            defender.length == 1 &&
            numberAttacker == 3
          ) {
            numberAttacker -= 1
          }
        }
      }

      const randomAttacker = getRandomAttacker(attacker, numberAttacker)

      if (
        battleResult == "WIN-PROCESSING" ||
        battleResult == "LOSE-PROCESSING"
      ) {
        randomDefender.alive -= numberAttacker
      }

      randomAttacker.forEach((hero) => {
        const x =
          randomDefender.x - hero.x > 0
            ? randomDefender.x - hero.x - hero.radius
            : randomDefender.x - hero.x + hero.radius
        const y = randomDefender.y - hero.y
        hero.projectileX = x > 0 ? 18 : -18
        hero.prokectileY = y / (x / hero.projectileX)
        hero.speed = -0.5
        hero.fire = true
      })
    }

    function getRandomAttacker(attacker, amount) {
      if (amount >= attacker.length) {
        return attacker
      }
      const shuffledArray = attacker.slice()
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        ;[shuffledArray[i], shuffledArray[randomIndex]] = [
          shuffledArray[randomIndex],
          shuffledArray[i],
        ]
      }

      return shuffledArray.slice(0, amount)
    }

    function battle(winSide, loseSide) {
      let alive = (winSide.length + loseSide.length) * 2
      for (let i = 0; i < winSide.length; i++) {
        winSide[i].alive =
          Math.ceil(alive / 2 / winSide.length) +
          Math.floor(Math.random() * 2) +
          1
        winSide[i].ratioDamage = 1 / winSide[i].alive
      }

      for (let i = 0; i < loseSide.length; i++) {
        loseSide[i].alive =
          Math.floor(alive / 2 / loseSide.length) +
          Math.floor(Math.random() * 2)
        loseSide[i].ratioDamage = 1 / loseSide[i].alive
      }

      randomExist = Math.floor(Math.random() * 2) + 1
    }

    function checkExist(winSide, loseSide) {
      winSide = winSide.filter((hero) => !hero.markedForDeletion)
      loseSide = loseSide.filter((hero) => !hero.markedForDeletion)
      if (winSide.length <= randomExist) {
        winSide.forEach((hero) => {
          if (hero.alive < 2) {
            hero.ratioDamage = 0
            loseSide.forEach((hero) => {
              hero.ratioDamage = 1 - hero.ratioDamage
            })
          }
        })
      }
    }

    function isWin(ally, enemy) {
      ally = ally.filter((hero) => !hero.markedForDeletion)
      enemy = enemy.filter((hero) => !hero.markedForDeletion)
      if (ally.length == 0 || enemy.length == 0) {
        return true
      }
      return false
    }

    const startBattle = async () => {
      while (!isWin(game.ally, game.enemy)) {
        if (battleResult == undefined) {
          await sleep(1000)
        } else {
          if (battleResult == "win") {
            battle(game.ally, game.enemy)
            battleResult = "WIN-PROCESSING"
          } else if (battleResult == "lose") {
            battle(game.enemy, game.ally)
            battleResult = "LOSE-PROCESSING"
          }

          if (battleResult == "WIN-PROCESSING") {
            checkExist(game.ally, game.enemy)
          } else if (battleResult == "LOSE-PROCESSING") {
            checkExist(game.enemy, game.ally)
          }
          if (round % 2 == 0) {
            randomAttack(game.ally, game.enemy)
          } else {
            randomAttack(game.enemy, game.ally)
          }
          round++

          await sleep(3000)
        }
      }
      setIsEnded(true)
    }

    startBattle()
    setShowSkipButton(true)
  }, [result])

  return (
    <div className="relative">
      <canvas
        id="game"
        className={classNames(isEnded ? "opacity-20" : "")}
      ></canvas>
      {showSkipButton && (
        <div className={"absolute bottom-[16px] right-[32px]"}>
          <Button
            shape={"rounded"}
            onClick={() => {
              // randomFight()
              setIsEnded(true)
            }}
            disabled={result == undefined || isEnded}
            size="small"
            isLoading={false}
          >
            Skip
          </Button>
        </div>
      )}
      {isEnded && (
        <GameResult result={result} hasLottery={hasLottery}></GameResult>
      )}
    </div>
  )
}
