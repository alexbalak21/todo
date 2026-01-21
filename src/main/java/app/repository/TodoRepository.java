package app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import app.model.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {
}
