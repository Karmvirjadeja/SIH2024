import json
import random

# Load adjacency list
def load_adjacency_list(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Ant Colony Optimization implementation
class AntColonyOptimization:
    def __init__(self, adjacency_list, start, end, num_ants, num_iterations, alpha, beta, evaporation_rate, pheromone_constant):
        self.graph = adjacency_list
        self.start = start
        self.end = end
        self.num_ants = num_ants
        self.num_iterations = num_iterations
        self.alpha = alpha  # Importance of pheromone
        self.beta = beta  # Importance of distance
        self.evaporation_rate = evaporation_rate
        self.pheromone_constant = pheromone_constant
        
        # Initialize pheromone levels on all edges
        self.pheromone = {node: {neighbor: 1.0 for neighbor in neighbors} for node, neighbors in self.graph.items()}

    def _select_next_node(self, current_node, visited):
        neighbors = self.graph[current_node]
        pheromones = self.pheromone[current_node]

        probabilities = []
        for neighbor, distance in neighbors.items():
            # Only consider neighbors with larger labels and not visited
            if neighbor not in visited and neighbor > current_node:
                prob = (pheromones[neighbor] ** self.alpha) * ((1.0 / distance) ** self.beta)
                probabilities.append((neighbor, prob))

        if not probabilities:
            return None

        # Normalize probabilities
        total_prob = sum(prob for _, prob in probabilities)
        probabilities = [(node, prob / total_prob) for node, prob in probabilities]

        # Roulette wheel selection
        rand = random.random()
        cumulative_prob = 0.0
        for node, prob in probabilities:
            cumulative_prob += prob
            if rand <= cumulative_prob:
                return node
        return None

    def _construct_solution(self):
        solutions = []
        for _ in range(self.num_ants):
            path = [self.start]
            visited = set(path)
            current_node = self.start

            while current_node != self.end:
                next_node = self._select_next_node(current_node, visited)
                if not next_node:
                    break
                path.append(next_node)
                visited.add(next_node)
                current_node = next_node

            # Only keep valid paths ending at the destination
            if path[-1] == self.end:
                solutions.append(path)
        return solutions

    def _calculate_path_length(self, path):
        length = 0.0
        for i in range(len(path) - 1):
            length += self.graph[path[i]][path[i + 1]]
        return length

    def _update_pheromones(self, solutions):
        # Evaporate existing pheromone
        for node in self.pheromone:
            for neighbor in self.pheromone[node]:
                self.pheromone[node][neighbor] *= (1.0 - self.evaporation_rate)

        # Add new pheromone based on solutions
        for path in solutions:
            length = self._calculate_path_length(path)
            pheromone_to_add = self.pheromone_constant / length if length > 0 else 0
            for i in range(len(path) - 1):
                self.pheromone[path[i]][path[i + 1]] += pheromone_to_add

    def run(self):
        best_path = None
        best_length = float('inf')

        for iteration in range(self.num_iterations):
            solutions = self._construct_solution()
            self._update_pheromones(solutions)

            for path in solutions:
                length = self._calculate_path_length(path)
                if length < best_length:
                    best_length = length
                    best_path = path
            
            print(f"Iteration {iteration + 1}: Best path length = {best_length}")
        
        return best_path, best_length

# Main function
def main():
    adjacency_list = load_adjacency_list('adjacency_list.json')
    start = 'Point-1'
    end = 'Point-79'

    # Parameters for ACO
    num_ants = 50  #10 
    num_iterations = 500  #100
    alpha = 1.0  # Pheromone importance
    beta = 2.0  # Distance importance
    evaporation_rate = 0.5  # Pheromone evaporation rate
    pheromone_constant = 100.0  # Pheromone deposited per ant

    # Initialize and run ACO
    aco = AntColonyOptimization(adjacency_list, start, end, num_ants, num_iterations, alpha, beta, evaporation_rate, pheromone_constant)
    best_path, best_length = aco.run()

    print(f"\nShortest path from {start} to {end}: {best_path}")
    print(f"Path length: {best_length}")

if __name__ == "__main__":
    main()