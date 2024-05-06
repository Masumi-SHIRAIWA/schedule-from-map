-- This is an empty migration.

CREATE TRIGGER insert_project
AFTER INSERT ON Project
BEGIN
    INSERT INTO Task (name, deadline, projectId, ownId, parentId) VALUES(NEW.name, NEW.deadline, NEW.id, 1, null);
END;