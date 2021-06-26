import random
from math import inf

COUNT = 0
CACHE = {}
table = [[None] * 9 for i in range(18)]


def random_bitstring():
    rng = random.SystemRandom()
    return rng.randint(0, 2 ** 18 - 1)


def init_zobrist():
    for i in range(18):
        for j in range(9):
            table[i][j] = random_bitstring()

    return table


def hash(board):
    h = 0

    for i in range(18):
        for j in range(9):
            if (board[j] & (1 << i)) != 0:
                h = h ^ table[i][j]

    return h


class Game:
    players = {1: "X", -1: "O"}
    masks = (
        0b000000111,
        0b000111000,
        0b111000000,  # rows
        0b001001001,
        0b010010010,
        0b100100100,  # columns
        0b100010001,
        0b001010100,  # diagonals
    )

    def __init__(
        self,
        all_boards=[0] * 9,
        global_board=0,
        ended_boards=0,
        full_boards=0,
        turn=1,
        focus=None,
        move=1,
    ):
        self.all_boards = all_boards
        self.global_board = global_board
        self.ended_boards = ended_boards
        self.full_boards = full_boards
        self.turn = turn
        self.focus = focus
        self.move = move
        init_zobrist()

    def mask(self, position, player):
        offset = 8 - position

        if player == 1:
            offset += 9

        return 1 << offset

    def print_board(self):
        def convert(i):
            board = []
            o_mask = 1 << 8
            x_mask = o_mask << 9

            while o_mask:
                board.append(
                    "O"
                    if self.all_boards[i] & o_mask
                    else "X"
                    if self.all_boards[i] & x_mask
                    else " "
                )
                o_mask >>= 1
                x_mask >>= 1

            return board

        all_boards = [convert(i) for i in range(9)]

        for i in range(0, 9, 3):
            print("\n--------------  --------------  --------------")

            for j in range(3):
                print(
                    f"|| {all_boards[i+j][0]} | {all_boards[i+j][1]} | {all_boards[i+j][2]}|| ",
                    end=" ",
                )

            print("\n--------------  --------------  --------------")

            for j in range(3):
                print(
                    f"|| {all_boards[i+j][3]} | {all_boards[i+j][4]} | {all_boards[i+j][5]}|| ",
                    end=" ",
                )

            print("\n--------------  --------------  --------------")

            for j in range(3):
                print(
                    f"|| {all_boards[i+j][6]} | {all_boards[i+j][7]} | {all_boards[i+j][8]}|| ",
                    end=" ",
                )

            print("\n--------------  --------------  --------------")

    def available_moves(self, focus=None):
        if focus is None:
            # return [[i for i in range(9) if not (self.mask(i, 1) | self.mask(i, -1)) & self.all_boards[j]] for j in range(9)]
            return []

        else:
            return [
                i
                for i in range(9)
                if not (self.mask(i, 1) | self.mask(i, -1)) & self.all_boards[focus]
            ]

    def get_focus(self, move):
        if (self.full_boards & (1 << move)) == 0:
            return move

        else:
            for i in range(9):
                if (self.full_boards & (1 << i)) == 0:
                    return i

    def set_move(self, focus, position, player):
        mask = self.mask(position, player)
        self.all_boards[focus] = self.all_boards[focus] | mask

        if (
            self.ended_boards & (1 << focus)
        ) == 0:  # If it is not an already ended board, calculate that board's winner.
            local_status = self.calculate_winner(self.all_boards[focus])

            if local_status is not None:
                self.ended_boards = self.ended_boards | (1 << focus)

                if local_status != 0:
                    mask = self.mask(focus, local_status)
                    self.global_board = self.global_board | mask

        if (
            bin(self.all_boards[focus]).count("1") == 9
        ):  # If the board is full, set its corresponding digit in full_boards to 1.
            self.full_boards = self.full_boards | (1 << focus)

    def remove_move(self, focus, position, player):
        if bin(self.all_boards[focus]).count("1") == 9:
            self.full_boards = self.full_boards & ~(
                1 << focus
            )  # If it was considered as a full board, remove its status.

        mask = self.mask(position, player)
        self.all_boards[focus] = self.all_boards[focus] & ~mask

        if (
            self.ended_boards & (1 << focus)
        ) != 0:  # If it is an ended board, then consider:
            local_status = self.calculate_winner(self.all_boards[focus])

            if local_status is None:
                mask_one = self.mask(focus, 1)
                mask_two = self.mask(focus, -1)
                self.global_board = self.global_board & ~mask_one
                self.global_board = self.global_board & ~mask_two
                self.ended_boards = self.ended_boards & ~(1 << focus)

    def calculate_winner(self, board):
        shifted = board >> 9

        for mask in self.masks:
            if board & mask == mask:
                return -1

            elif shifted & mask == mask:
                return 1

        if bin(board).count("1") == 9:
            return 0

        return None

    def heuristic_evaluation(self):
        result = self.calculate_winner(self.global_board)

        if result == -self.turn:
            return -10

        elif result == self.turn:
            return 10

        elif bin(self.ended_boards).count("1") == 9:
            return 0

        else:
            return None

    def alpha_beta(self, depth, α, β, focus, maximizing_player=True):
        player = self.turn if maximizing_player else -self.turn

        if (hash(self.all_boards), player) in CACHE:
            return CACHE[(hash(self.all_boards), player)]

        global COUNT
        COUNT += 1

        if depth == 0 or self.heuristic_evaluation() is not None:
            score = self.heuristic_evaluation()
            return [None, score]

        if maximizing_player:
            best = [None, α]

            for move in self.available_moves(focus):
                self.set_move(focus, move, self.turn)
                next_focus = self.get_focus(move)
                s = self.alpha_beta(depth - 1, α, β, next_focus, False)
                self.remove_move(focus, move, self.turn)

                if s[1] > best[1]:
                    best = [move, s[1]]

                α = max(α, best[1])

                if α >= β:
                    break

        else:
            best = [None, β]

            for move in self.available_moves(focus):
                self.set_move(focus, move, -self.turn)
                next_focus = self.get_focus(move)
                s = self.alpha_beta(depth - 1, α, β, next_focus, True)
                self.remove_move(focus, move, -self.turn)

                if s[1] < best[1]:
                    best = [move, s[1]]
                """
                if best[0] == None:
                    print(f'Move: {move} - Focus: {focus} - Next Focus: {self.get_focus(move)} - Available Moves: {self.available_moves(focus)} - Depth: {depth} - Full Boards: {bin(self.full_boards)} - Score: {best} - Her. Eva.: {self.heuristic_evaluation(depth)}')
                    self.print_global()
                """

                β = min(β, best[1])

                if α >= β:
                    break

        CACHE[(hash(self.all_boards), player)] = best

        return best

    def run_game(self):
        global COUNT

        while self.heuristic_evaluation() is None:
            if self.move == 1:
                self.focus = 0
                best_move = 4

            else:
                depth = 82 - self.move
                best_move = self.alpha_beta(depth, -inf, inf, self.focus)[0]

            self.set_move(self.focus, best_move, self.turn)
            self.turn = -self.turn
            self.focus = self.get_focus(best_move)

            print(f"Move number: {self.move} - COUNT: {COUNT} - Focus: {self.focus}")
            self.print_board()
            self.move += 1

        res = self.calculate_winner(self.global_board)

        if res == "-":
            print("It is a draw.")

        else:
            print(f"Winner is: {self.players[res]}")


if __name__ == "__main__":
    game = Game()
    game.run_game()
